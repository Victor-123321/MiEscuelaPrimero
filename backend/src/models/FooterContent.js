'use strict';

const { query } = require('../config/database');

class FooterContent {
  static async findAll() {
    const rows = await query('SELECT * FROM footer_content ORDER BY content_key ASC');
    // Convert to key-value map for convenience
    return rows.reduce((acc, row) => {
      acc[row.content_key] = row.content_value;
      return acc;
    }, {});
  }

  static async findByKey(contentKey) {
    const rows = await query('SELECT * FROM footer_content WHERE content_key = ?', [contentKey]);
    return rows[0] || null;
  }

  static async update(contentKey, contentValue, updatedBy) {
    await query(
      'UPDATE footer_content SET content_value = ?, updated_by = ? WHERE content_key = ?',
      [contentValue, updatedBy || null, contentKey]
    );
    return FooterContent.findByKey(contentKey);
  }
}

module.exports = FooterContent;
