'use strict';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const optional = (name, defaultValue) => process.env[name] || defaultValue;

const config = {
  env: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '3000'), 10),
  logLevel: optional('LOG_LEVEL', 'info'),

  db: {
    host: optional('DB_HOST', 'localhost'),
    port: parseInt(optional('DB_PORT', '3306'), 10),
    name: optional('DB_NAME', 'mi_escuela_primero'),
    user: optional('DB_USER', 'root'),
    password: optional('DB_PASSWORD', ''),
    poolMin: parseInt(optional('DB_POOL_MIN', '2'), 10),
    poolMax: parseInt(optional('DB_POOL_MAX', '10'), 10),
  },

  jwt: {
    secret: optional('JWT_SECRET', 'dev_secret_change_in_production'),
    expiration: parseInt(optional('JWT_EXPIRATION', '3600'), 10),
    refreshExpiration: parseInt(optional('REFRESH_TOKEN_EXPIRATION', '604800'), 10),
  },

  security: {
    bcryptRounds: parseInt(optional('BCRYPT_ROUNDS', '12'), 10),
    rateLimitMax: parseInt(optional('RATE_LIMIT_MAX_REQUESTS', '5'), 10),
    rateLimitWindow: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  },

  cors: {
    origin: optional('CORS_ORIGIN', 'http://localhost:5173'),
  },

  email: {
    service: optional('EMAIL_SERVICE', 'gmail'),
    from: optional('EMAIL_FROM', 'noreply@mpj.org.mx'),
    user: optional('EMAIL_USER', ''),
    pass: optional('EMAIL_PASS', ''),
  },
};

module.exports = config;
