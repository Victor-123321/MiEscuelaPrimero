'use strict';

const authService = require('../services/authService');
const { successResponse } = require('../utils/formatters');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    return successResponse(res, result, 'Inicio de sesión exitoso');
  } catch (err) {
    return next(err);
  }
}

async function logout(_req, res) {
  // JWT is stateless; instruct client to discard token
  return successResponse(res, null, 'Sesión cerrada exitosamente');
}

async function verify(req, res, next) {
  try {
    const user = await authService.verifyToken(req.user);
    return successResponse(res, { user }, 'Token válido');
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, logout, verify };
