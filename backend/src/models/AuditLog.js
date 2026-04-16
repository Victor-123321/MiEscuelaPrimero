'use strict';

const { query } = require('../config/database');

class AuditLog {
  static async create({ adminId, action, entityType, entityId, changes, ipAddress, userAgent }) {
    await query(
      `INSERT INTO audit_log (admin_id, action, entity_type, entity_id, changes, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        adminId || null,
        action,
        entityType || null,
        entityId || null,
        changes ? JSON.stringify(changes) : null,
        ipAddress || null,
        userAgent ? userAgent.substring(0, 500) : null,
      ]
    );
  }
}

module.exports = AuditLog;
