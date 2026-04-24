'use strict';

const XLSX = require('xlsx');
const School = require('../models/School');
const FileUploadLog = require('../models/FileUploadLog');
const AuditLog = require('../models/AuditLog');
const { AppError } = require('../middleware/errorHandler');
const MESSAGES = require('../utils/errorMessages');
const logger = require('../utils/logger');

/**
 * Parse Sheet 2 ("Datos de las escuelas") from the workbook.
 * Headers at row index 4, data from row 5 (0-based).
 * Returns an array of school data objects.
 */
function parseEscuelasSheet(workbook) {
  const sheet = workbook.Sheets['Datos de las escuelas'];
  if (!sheet) throw new AppError('El archivo no contiene la hoja "Datos de las escuelas".', 400);

  // Get raw rows as arrays (no headers interpretation)
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Data starts at row index 5 (0-based)
  const dataRows = rows.slice(5);

  const schools = [];
  for (const row of dataRows) {
    // Skip rows where col[1] (Municipio) is empty
    if (!row[1] && !String(row[1] || '').trim()) continue;
    const municipio = String(row[1] || '').trim();
    if (!municipio) continue;

    schools.push({
      municipio,
      plantel: String(row[2] || '').trim() || null,
      escuela: String(row[3] || '').trim(),
      personal_escolar: parseInt(row[4], 10) || null,
      estudiantes: parseInt(row[5], 10) || null,
      nivel_educativo: String(row[6] || '').trim() || null,
      cct: String(row[7] || '').trim() || null,
      modalidad: String(row[8] || '').trim() || null,
      turno: String(row[9] || '').trim() || null,
      sostenimiento: String(row[10] || '').trim() || null,
      direccion: String(row[11] || '').trim() || null,
      ubicacion: String(row[12] || '').trim() || null,
    });
  }
  return schools;
}

/**
 * Parse Sheet 1 ("Necesidades") from the workbook.
 * Headers at row index 3, data from row 4 (0-based).
 * Returns an array of need data objects with an `escuela` field for matching.
 */
function parseNecesidadesSheet(workbook) {
  const sheet = workbook.Sheets['Necesidades'];
  if (!sheet) throw new AppError('El archivo no contiene la hoja "Necesidades".', 400);

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Data starts at row index 4 (0-based)
  const dataRows = rows.slice(4);

  const needs = [];
  for (const row of dataRows) {
    // Skip rows where col[0] (Municipio) is empty
    const municipio = String(row[0] || '').trim();
    if (!municipio) continue;

    needs.push({
      municipio,
      escuela: String(row[1] || '').trim(),
      categoria: String(row[2] || '').trim(),
      subcategoria: String(row[3] || '').trim() || null,
      propuesta: String(row[4] || '').trim(),
      cantidad: parseInt(row[5], 10) || null,
      unidad: String(row[6] || '').trim() || null,
      estado: String(row[7] || '').trim() || 'Aun no cubierto',
      detalles: String(row[8] || '').trim() || null,
    });
  }
  return needs;
}

/**
 * Loose name matching: find the school ID whose escuela field best matches
 * the need's escuela value (handles abbreviated names).
 */
function matchSchool(schoolMap, needEscuela) {
  // Exact match first
  if (schoolMap[needEscuela]) return schoolMap[needEscuela];
  // Prefix / substring match
  for (const [k, v] of Object.entries(schoolMap)) {
    if (k.startsWith(needEscuela) || needEscuela.startsWith(k)) return v;
  }
  return null;
}

async function processUpload(file, adminContext) {
  const { originalname, buffer, mimetype, size } = file;

  // Only accept XLSX/XLS
  const isXlsx = originalname.endsWith('.xlsx') || originalname.endsWith('.xls') ||
    mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimetype === 'application/vnd.ms-excel';

  if (!isXlsx) {
    throw new AppError('El formato debe ser XLSX con 2 hojas: "Necesidades" y "Datos de las escuelas".', 400);
  }

  // Create upload log entry
  const log = await FileUploadLog.create({
    filename: originalname,
    fileSize: size,
    uploadBy: adminContext.userId,
  });

  let schoolsProcessed = 0;
  let needsProcessed = 0;
  let failed = 0;
  const errors = [];

  try {
    await FileUploadLog.update(log.id, { status: 'processing', rowsProcessed: 0, rowsSuccessful: 0, rowsFailed: 0 });

    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // --- Pass 1: upsert schools from Sheet 2 ---
    const escuelasData = parseEscuelasSheet(workbook);
    const schoolMap = {}; // escuela name → school id

    for (let i = 0; i < escuelasData.length; i++) {
      const schoolData = escuelasData[i];
      try {
        if (!schoolData.escuela || !schoolData.municipio) {
          throw new Error('Escuela y municipio son requeridos.');
        }
        const id = await School.upsertByEscuela(schoolData);
        schoolMap[schoolData.escuela] = id;
        schoolsProcessed++;
      } catch (err) {
        failed++;
        errors.push({ sheet: 'Datos de las escuelas', row: i + 6, error: err.message });
        logger.warn(`Upload escuela row ${i + 6} failed`, { error: err.message });
      }
    }

    // --- Pass 2: replace needs from Sheet 1 ---
    const necesidadesData = parseNecesidadesSheet(workbook);

    // Group needs by escuela name
    const needsByEscuela = {};
    for (const need of necesidadesData) {
      const schoolId = matchSchool(schoolMap, need.escuela);
      if (!schoolId) {
        failed++;
        errors.push({ sheet: 'Necesidades', escuela: need.escuela, error: 'No se encontró la escuela correspondiente.' });
        logger.warn(`Upload need: school not found for "${need.escuela}"`);
        continue;
      }
      if (!needsByEscuela[schoolId]) needsByEscuela[schoolId] = [];
      needsByEscuela[schoolId].push(need);
    }

    // Replace needs per school
    for (const [schoolId, needs] of Object.entries(needsByEscuela)) {
      try {
        await School.replaceNeeds(parseInt(schoolId, 10), needs);
        needsProcessed += needs.length;
      } catch (err) {
        failed++;
        errors.push({ sheet: 'Necesidades', school_id: schoolId, error: err.message });
        logger.warn(`Upload replaceNeeds failed for school ${schoolId}`, { error: err.message });
      }
    }

    const totalRows = escuelasData.length + necesidadesData.length;
    const successful = schoolsProcessed + needsProcessed;

    await FileUploadLog.update(log.id, {
      status: 'completed',
      rowsProcessed: totalRows,
      rowsSuccessful: successful,
      rowsFailed: failed,
    });

    await AuditLog.create({
      adminId: adminContext.userId,
      action: 'upload_file',
      entityType: 'file_upload',
      entityId: log.id,
      changes: { filename: originalname, schools: schoolsProcessed, needs: needsProcessed, failed },
      ipAddress: adminContext.ip,
      userAgent: adminContext.userAgent,
    });

    return {
      upload_id: log.id,
      filename: originalname,
      schools_processed: schoolsProcessed,
      needs_processed: needsProcessed,
      rows_failed: failed,
      errors,
    };
  } catch (err) {
    await FileUploadLog.update(log.id, {
      status: 'failed',
      rowsProcessed: 0,
      rowsSuccessful: 0,
      rowsFailed: 0,
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
