'use strict';

const bcrypt = require('bcrypt');
const config = require('../config/environment');

async function hashPassword(password) {
  return bcrypt.hash(password, config.security.bcryptRounds);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function buildPagination(limit, offset, total) {
  const safeLimit = Math.min(parseInt(limit, 10) || 20, 100);
  const safeOffset = parseInt(offset, 10) || 0;
  return {
    limit: safeLimit,
    offset: safeOffset,
    total,
    pages: Math.ceil(total / safeLimit),
  };
}

function parseBooleanFilter(value) {
  if (value === 'true' || value === '1') return 1;
  if (value === 'false' || value === '0') return 0;
  return null;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

module.exports = { hashPassword, comparePassword, buildPagination, parseBooleanFilter, sanitizeString };
