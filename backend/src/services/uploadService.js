'use strict';

const Papa = require('papaparse');
const XLSX = require('xlsx');
const School = require('../models/School');
const FileUploadLog = require('../models/FileUploadLog');
const AuditLog = require('../models/AuditLog');
const { AppError } = require('../middleware/errorHandler');
const MESSAGES = require('../utils/errorMessages');
const { UPLOAD_COLUMNS } = require('../config/constants');
const logger = require('../utils/logger');

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

function validateColumns(rows) {
  if (!rows.length) return [];
  const headers = Object.keys(rows[0]);
  const missing = UPLOAD_COLUMNS.filter((col) => !headers.includes(col));
  return missing;
}

function rowToSchoolData(row) {
  return {
    name: String(row.school_name || '').trim(),
    municipality: String(row.municipality || '').trim(),
    category: String(row.category || '').trim() || null,
    type: String(row.type || '').trim() || null,
    description: String(row.description || '').trim() || null,
    funding_pct: parseFloat(row.funding_pct) || 0,
    students: parseInt(row.students, 10) || null,
    teachers: parseInt(row.teachers, 10) || null,
    urgent: ['true', '1', 'si', 'sí', 'yes'].includes(String(row.urgent || '').toLowerCase()),
    status: 'active',
  };
}

async function processUpload(file, adminContext) {
  const { originalname, buffer, mimetype, size } = file;

  // Create upload log entry
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

    const missingCols = validateColumns(rows);
    if (missingCols.length) {
      throw new AppError(MESSAGES.UPLOAD.MISSING_COLUMNS(missingCols), 400);
    }

    let successful = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const data = rowToSchoolData(row);
        if (!data.name || !data.municipality) {
          throw new Error('school_name y municipality son requeridos.');
        }
        await School.create(data);
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
