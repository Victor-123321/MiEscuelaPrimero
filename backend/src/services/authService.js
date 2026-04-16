'use strict';

const AdminUser = require('../models/AdminUser');
const AuditLog = require('../models/AuditLog');
const { comparePassword } = require('../utils/helpers');
const { signToken } = require('../utils/jwt');
const { AuthenticationError } = require('../middleware/errorHandler');
const MESSAGES = require('../utils/errorMessages');
const logger = require('../utils/logger');

async function login(email, password, { ip, userAgent } = {}) {
  const user = await AdminUser.findByEmail(email);

  if (!user) {
    logger.warn('Login failed: user not found', { email, ip });
    throw new AuthenticationError(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  if (!user.is_active) {
    throw new AuthenticationError(MESSAGES.AUTH.ACCOUNT_INACTIVE);
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    logger.warn('Login failed: wrong password', { email, ip });
    await AuditLog.create({ adminId: user.id, action: 'login_failed', ipAddress: ip, userAgent });
    throw new AuthenticationError(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  await AdminUser.updateLastLogin(user.id);
  await AuditLog.create({ adminId: user.id, action: 'login_success', ipAddress: ip, userAgent });

  const token = signToken({ user_id: user.id, email: user.email, role: user.role });

  logger.info('Login successful', { email, ip });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
  };
}

async function verifyToken(decoded) {
  const user = await AdminUser.findById(decoded.user_id);
  if (!user || !user.is_active) {
    throw new AuthenticationError(MESSAGES.AUTH.TOKEN_INVALID);
  }
  return user;
}

module.exports = { login, verifyToken };
