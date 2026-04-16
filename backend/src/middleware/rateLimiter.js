'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../config/environment');

const loginLimiter = rateLimit({
  windowMs: config.security.rateLimitWindow,
  max: config.security.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    errors: [
      {
        message:
          'Demasiados intentos de inicio de sesión. Por favor, intenta de nuevo en 15 minutos.',
      },
    ],
    message: 'Demasiadas solicitudes',
    timestamp: new Date().toISOString(),
    version: 'v1',
  },
  skipSuccessfulRequests: true,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    errors: [{ message: 'Demasiadas solicitudes. Por favor, intenta más tarde.' }],
    message: 'Límite de solicitudes excedido',
    timestamp: new Date().toISOString(),
    version: 'v1',
  },
});

module.exports = { loginLimiter, apiLimiter };
