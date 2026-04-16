'use strict';

const { query } = require('../config/database');

class Stat {
  static async findAll() {
    return query('SELECT * FROM stats ORDER BY display_order ASC');
  }

  static async findByKey(statKey) {
    const rows = await query('SELECT * FROM stats WHERE stat_key = ?', [statKey]);
    return rows[0] || null;
  }

  static async update(statKey, data, updatedBy) {
    const { stat_value, stat_label, display_order } = data;
    const fields = ['stat_value = ?'];
    const params = [stat_value];

    if (stat_label !== undefined) { fields.push('stat_label = ?'); params.push(stat_label); }
    if (display_order !== undefined) { fields.push('display_order = ?'); params.push(display_order); }
    if (updatedBy) { fields.push('updated_by = ?'); params.push(updatedBy); }

    params.push(statKey);
    await query(`UPDATE stats SET ${fields.join(', ')} WHERE stat_key = ?`, params);
    return Stat.findByKey(statKey);
  }
}

module.exports = Stat;
