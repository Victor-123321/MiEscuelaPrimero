'use strict';

const XLSX = require('xlsx');
const School = require('../models/School');
const FileUploadLog = require('../models/FileUploadLog');
const AuditLog = require('../models/AuditLog');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

function parseEscuelasSheet(workbook) {
  const sheet = workbook.Sheets['Datos de las escuelas'];
  if (!sheet) throw new AppError('El archivo no contiene la hoja "Datos de las escuelas".', 400);

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const dataRows = rows.slice(5); // data starts at index 5

  const schools = [];
  for (const row of dataRows) {
    const municipio = String(row[1] || '').trim();
    if (!municipio) continue;

    schools.push({
      municipio,
      plantel:          String(row[2]  || '').trim() || null,
      escuela:          String(row[3]  || '').trim(),
      personal_escolar: parseInt(row[4],  10) || null,
      estudiantes:      parseInt(row[5],  10) || null,
      nivel_educativo:  String(row[6]  || '').trim() || null,
      cct:              String(row[7]  || '').trim() || null,
      modalidad:        String(row[8]  || '').trim() || null,
      turno:            String(row[9]  || '').trim() || null,
      sostenimiento:    String(row[10] || '').trim() || null,
      direccion:        String(row[11] || '').trim() || null,
      ubicacion:        String(row[12] || '').trim() || null,
    });
  }
  return schools;
}

// hoja Necesidades: !ref empieza en B1, entonces row[0] = columna B = Municipio
function parseNecesidadesSheet(workbook) {
  const sheet = workbook.Sheets['Necesidades'];
  if (!sheet) throw new AppError('El archivo no contiene la hoja "Necesidades".', 400);

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  const dataRows = rows.slice(4); // data starts at index 4

  const needs = [];
  for (const row of dataRows) {
    // col[0] is Municipio (sheet range B1:K1084 → index 0 = column B)
    const municipio = String(row[0] || '').trim();
    if (!municipio) continue;

    needs.push({
      municipio,
      escuela:      String(row[1] || '').trim(),
      categoria:    String(row[2] || '').trim(),
      subcategoria: String(row[3] || '').trim() || null,
      propuesta:    String(row[4] || '').trim(),
      cantidad:     parseInt(row[5], 10) || null,
      unidad:       String(row[6] || '').trim() || null,
      estado:       String(row[7] || '').trim() || 'Aun no cubierto',
      detalles:     String(row[8] || '').trim() || null,
    });
  }
  return needs;
}

function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function matchSchool(schoolMap, needEscuela) {
  if (schoolMap[needEscuela]) return schoolMap[needEscuela];

  const normNeed = normalize(needEscuela);

  // 2. Accent-insensitive exact
  for (const [k, v] of Object.entries(schoolMap)) {
    if (normalize(k) === normNeed) return v;
  }

  // 3. Prefix / substring — pick the school whose normalized key best (longest) matches
  let bestKey = null, bestLen = 0;
  for (const [k] of Object.entries(schoolMap)) {
    const normK = normalize(k);
    if (normK.startsWith(normNeed) || normNeed.startsWith(normK)) {
      if (normK.length > bestLen) { bestKey = k; bestLen = normK.length; }
    }
  }
  if (bestKey) return schoolMap[bestKey];

  return null;
}

async function processUpload(file, adminContext) {
  const { originalname, buffer, mimetype, size } = file;

  const isXlsx = originalname.endsWith('.xlsx') || originalname.endsWith('.xls') ||
    mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimetype === 'application/vnd.ms-excel';

  if (!isXlsx) {
    throw new AppError('El formato debe ser XLSX con 2 hojas: "Necesidades" y "Datos de las escuelas".', 400);
  }

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

    const escuelasData = parseEscuelasSheet(workbook);
    const schoolMap = {};

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

    // Group needs by school id
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
