'use strict';

const Papa = require('papaparse');
const XLSX = require('xlsx');
const { query } = require('../config/database');
const School = require('../models/School');
const FileUploadLog = require('../models/FileUploadLog');
const AuditLog = require('../models/AuditLog');
const { AppError } = require('../middleware/errorHandler');
const MESSAGES = require('../utils/errorMessages');
const logger = require('../utils/logger');

// ── Excel column names (case-insensitive) ─────────────────────────────────
// Expected: Municipio | Escuela | Categoría | Subcategoría | Propuesta | Cantidad | Unidad | Estado | Detalles
const COL = {
  municipio:    ['municipio'],
  escuela:      ['escuela', 'nombre_escuela', 'school_name'],
  categoria:    ['categoria', 'categoría', 'category'],
  subcategoria: ['subcategoria', 'subcategoría', 'subcategory'],
  propuesta:    ['propuesta', 'proposal', 'articulo'],
  cantidad:     ['cantidad', 'quantity'],
  unidad:       ['unidad', 'unit'],
  estado:       ['estado', 'status', 'state'],
  detalles:     ['detalles', 'details', 'descripcion', 'descripción'],
};

function getCol(row, aliases) {
  for (const alias of aliases) {
    const key = Object.keys(row).find(k => k.toLowerCase().trim() === alias);
    if (key !== undefined) return String(row[key] ?? '').trim();
  }
  return '';
}

function parseCSV(buffer) {
  const text = buffer.toString('utf8');
  const { data, errors } = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (errors.length) logger.warn('CSV parse warnings', { count: errors.length });
  return data;
}

function parseXLSX(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

async function findOrCreateSchool(name, municipality) {
  const rows = await query(
    'SELECT id FROM schools WHERE name = ? AND municipality = ? AND status = "active" LIMIT 1',
    [name, municipality]
  );
  if (rows.length) return rows[0].id;

  const result = await query(
    'INSERT INTO schools (name, municipality, status) VALUES (?, ?, "active")',
    [name, municipality]
  );
  return result.insertId;
}

async function processUpload(file, adminContext) {
  const { originalname, buffer, mimetype, size } = file;

  const log = await FileUploadLog.create({
    filename: originalname,
    fileSize: size,
    uploadBy: adminContext.userId,
  });

  let rows = [];
  try {
    await FileUploadLog.update(log.id, { status: 'processing', rowsProcessed: 0, rowsSuccessful: 0, rowsFailed: 0 });

    if (originalname.endsWith('.csv') || mimetype === 'text/csv') {
      rows = parseCSV(buffer);
    } else if (originalname.endsWith('.xlsx') || originalname.endsWith('.xls')) {
      rows = parseXLSX(buffer);
    } else {
      throw new AppError(MESSAGES.UPLOAD.INVALID_FORMAT, 400);
    }

    if (!rows.length) throw new AppError('El archivo está vacío.', 400);

    let successful = 0;
    let failed = 0;
    const errors = [];

    // Cache school ids to avoid duplicate lookups
    const schoolCache = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const municipio    = getCol(row, COL.municipio);
        const escuela      = getCol(row, COL.escuela);
        const categoria    = getCol(row, COL.categoria);
        const subcategoria = getCol(row, COL.subcategoria);
        const propuesta    = getCol(row, COL.propuesta);
        const cantidadStr  = getCol(row, COL.cantidad);
        const unidad       = getCol(row, COL.unidad);
        const estado       = getCol(row, COL.estado);
        const detalles     = getCol(row, COL.detalles);

        if (!municipio || !escuela) {
          throw new Error('Municipio y Escuela son requeridos.');
        }

        const cacheKey = `${municipio.toLowerCase()}|||${escuela.toLowerCase()}`;
        if (!schoolCache[cacheKey]) {
          schoolCache[cacheKey] = await findOrCreateSchool(escuela, municipio);
        }
        const schoolId = schoolCache[cacheKey];

        const cantidad = cantidadStr !== '' ? parseFloat(cantidadStr) : null;

        await query(
          `INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            schoolId,
            categoria || null,
            subcategoria || null,
            propuesta || null,
            isNaN(cantidad) ? null : cantidad,
            unidad || null,
            estado || null,
            detalles || null,
          ]
        );
        successful++;
      } catch (err) {
        failed++;
        errors.push({ row: i + 2, error: err.message });
        logger.warn(`Upload row ${i + 2} failed`, { error: err.message });
      }
    }

    await FileUploadLog.update(log.id, {
      status: 'completed',
      rowsProcessed: rows.length,
      rowsSuccessful: successful,
      rowsFailed: failed,
    });

    await AuditLog.create({
      adminId: adminContext.userId,
      action: 'upload_file',
      entityType: 'file_upload',
      entityId: log.id,
      changes: { filename: originalname, rows: rows.length, successful, failed },
      ipAddress: adminContext.ip,
      userAgent: adminContext.userAgent,
    });

    return {
      upload_id: log.id,
      filename: originalname,
      rows_processed: rows.length,
      rows_successful: successful,
      rows_failed: failed,
      errors,
    };
  } catch (err) {
    await FileUploadLog.update(log.id, {
      status: 'failed',
      rowsProcessed: rows.length,
      rowsSuccessful: 0,
      rowsFailed: rows.length,
      errorMessage: err.message,
    });
    throw err;
  }
}

async function getUploadHistory({ limit = 20, offset = 0 } = {}) {
  return FileUploadLog.findAll({ limit, offset });
}

async function getUploadById(id) {
  const upload = await FileUploadLog.findById(id);
  if (!upload) throw new AppError('Registro de carga no encontrado.', 404);
  return upload;
}

module.exports = { processUpload, getUploadHistory, getUploadById };
