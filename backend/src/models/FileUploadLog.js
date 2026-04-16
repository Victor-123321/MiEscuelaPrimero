'use strict';

const { query } = require('../config/database');

class FileUploadLog {
  static async create({ filename, fileSize, uploadBy }) {
    const result = await query(
      'INSERT INTO file_upload_log (filename, file_size, upload_by, status) VALUES (?, ?, ?, ?)',
      [filename, fileSize || null, uploadBy || null, 'pending']
    );
    return FileUploadLog.findById(result.insertId);
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM file_upload_log WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findAll({ limit = 20, offset = 0 } = {}) {
    const rows = await query(
      'SELECT * FROM file_upload_log ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [countRow] = await query('SELECT COUNT(*) AS total FROM file_upload_log');
    return { uploads: rows, total: countRow.total };
  }

  static async update(id, { status, rowsProcessed, rowsSuccessful, rowsFailed, errorMessage }) {
    await query(
      `UPDATE file_upload_log SET status = ?, rows_processed = ?, rows_successful = ?, rows_failed = ?, error_message = ? WHERE id = ?`,
      [status, rowsProcessed || 0, rowsSuccessful || 0, rowsFailed || 0, errorMessage || null, id]
    );
    return FileUploadLog.findById(id);
  }
}

module.exports = FileUploadLog;
