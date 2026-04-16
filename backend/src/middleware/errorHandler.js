'use strict';

const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(errors = []) {
    super('Los datos enviados no son válidos. Revisa los errores indicados.', 400, errors);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Se requiere autenticación.') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'No tienes permisos para realizar esta acción.') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'El recurso solicitado no fue encontrado.') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const timestamp = new Date().toISOString();

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      errors: err.errors.length ? err.errors : [{ message: err.message }],
      message: err.message,
      timestamp,
      version: 'v1',
    });
  }

  // Unexpected error — log full details, return safe message
  logger.error('Unexpected error', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    errors: [{ message: 'Ocurrió un error interno. Por favor, intenta de nuevo más tarde.' }],
    message: 'Error interno del servidor',
    timestamp,
    version: 'v1',
  });
}

module.exports = {
  errorHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
};
