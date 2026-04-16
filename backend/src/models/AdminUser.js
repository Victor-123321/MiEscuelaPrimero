'use strict';

const { query } = require('../config/database');

class AdminUser {
  static async findByEmail(email) {
    const rows = await query('SELECT * FROM admin_users WHERE email = ? AND is_active = TRUE', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const rows = await query('SELECT id, email, first_name, last_name, role, is_active, last_login, created_at FROM admin_users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async updateLastLogin(id) {
    await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [id]);
  }
}

module.exports = AdminUser;
