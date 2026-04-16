'use strict';

function successResponse(res, data, message = 'Operación completada exitosamente', statusCode = 200, extra = {}) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    version: 'v1',
    ...extra,
  });
}

function errorResponse(res, message, errors = [], statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    errors,
    message,
    timestamp: new Date().toISOString(),
    version: 'v1',
  });
}

function paginatedResponse(res, data, pagination, message = 'Operación completada exitosamente') {
  return successResponse(res, data, message, 200, { pagination });
}

module.exports = { successResponse, errorResponse, paginatedResponse };
