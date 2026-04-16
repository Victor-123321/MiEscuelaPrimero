'use strict';

const multer = require('multer');
const uploadService = require('../services/uploadService');
const { successResponse, paginatedResponse } = require('../utils/formatters');
const { AppError } = require('../middleware/errorHandler');
const MESSAGES = require('../utils/errorMessages');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(_req, file, cb) {
    const allowed = ['.csv', '.xlsx', '.xls'];
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (allowed.includes(ext)) return cb(null, true);
    return cb(new AppError(MESSAGES.UPLOAD.INVALID_FORMAT, 400));
  },
});

const uploadMiddleware = upload.single('file');

function adminContext(req) {
  return { userId: req.user?.user_id, ip: req.ip, userAgent: req.get('user-agent') };
}

async function uploadSchools(req, res, next) {
  uploadMiddleware(req, res, async (err) => {
    if (err) return next(err instanceof AppError ? err : new AppError(err.message, 400));
    if (!req.file) return next(new AppError(MESSAGES.UPLOAD.NO_FILE, 400));

    try {
      const result = await uploadService.processUpload(req.file, adminContext(req));
      return successResponse(res, result, 'Archivo procesado exitosamente', 201);
    } catch (uploadErr) {
      return next(uploadErr);
    }
  });
}

async function getUploadHistory(req, res, next) {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const { uploads, total } = await uploadService.getUploadHistory({ limit: parseInt(limit, 10), offset: parseInt(offset, 10) });
    return paginatedResponse(res, uploads, { limit, offset, total }, 'Historial de cargas obtenido');
  } catch (err) {
    return next(err);
  }
}

async function getUploadById(req, res, next) {
  try {
    const upload = await uploadService.getUploadById(parseInt(req.params.id, 10));
    return successResponse(res, upload, 'Detalle de carga obtenido');
  } catch (err) {
    return next(err);
  }
}

module.exports = { uploadSchools, getUploadHistory, getUploadById };
