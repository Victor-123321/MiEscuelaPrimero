'use strict';

const { verifyToken } = require('../utils/jwt');
const { AuthenticationError, AuthorizationError } = require('./errorHandler');
const logger = require('../utils/logger');

function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Se requiere autenticación para acceder a este recurso.'));
  }

  const token = authHeader.slice(7);
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    logger.warn('Invalid JWT token', { error: err.message, ip: req.ip });
    return next(new AuthenticationError('El token de autenticación es inválido o ha expirado.'));
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
