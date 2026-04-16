'use strict';

const { query } = require('../config/database');

class School {
  static async findAll({ limit = 20, offset = 0, municipality, category, type, urgent, search, sortBy = 'created_at', sortOrder = 'desc' } = {}) {
    const allowedSortFields = ['id', 'name', 'municipality', 'funding_pct', 'students', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const conditions = ['s.status = ?'];
    const params = ['active'];

    if (municipality) { conditions.push('s.municipality = ?'); params.push(municipality); }
    if (category) { conditions.push('s.category = ?'); params.push(category); }
    if (type) { conditions.push('s.type = ?'); params.push(type); }
    if (urgent !== null && urgent !== undefined) { conditions.push('s.urgent = ?'); params.push(urgent); }
    if (search) {
      conditions.push('(s.name LIKE ? OR s.description LIKE ? OR s.municipality LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    const where = conditions.join(' AND ');

    const [countRows] = await query(`SELECT COUNT(*) AS total FROM schools s WHERE ${where}`, params);
    const total = countRows.total;

    const schools = await query(
      `SELECT s.* FROM schools s WHERE ${where} ORDER BY s.${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Attach needs for each school
    for (const school of schools) {
      school.needs = await School.findNeeds(school.id);
    }

    return { schools, total };
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM schools WHERE id = ?', [id]);
    if (!rows.length) return null;
    const school = rows[0];
    school.needs = await School.findNeeds(id);
    return school;
  }

  static async findNeeds(schoolId) {
    return query('SELECT * FROM school_needs WHERE school_id = ? ORDER BY created_at ASC', [schoolId]);
  }

  static async create(data) {
    const { name, municipality, category, type, description, students, teachers, funding_pct, urgent, status, school_image_url } = data;
    const result = await query(
      `INSERT INTO schools (name, municipality, category, type, description, students, teachers, funding_pct, urgent, status, school_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, municipality, category || null, type || null, description || null, students || null, teachers || null, funding_pct || 0, urgent ? 1 : 0, status || 'active', school_image_url || null]
    );
    return School.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    const allowed = ['name', 'municipality', 'category', 'type', 'description', 'students', 'teachers', 'funding_pct', 'urgent', 'status', 'school_image_url'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (!fields.length) return School.findById(id);

    params.push(id);
    await query(`UPDATE schools SET ${fields.join(', ')} WHERE id = ?`, params);
    return School.findById(id);
  }

  static async softDelete(id) {
    await query("UPDATE schools SET status = 'inactive' WHERE id = ?", [id]);
  }

  static async addNeed(schoolId, data) {
    const { title, description, amount_needed, amount_funded, status } = data;
    const result = await query(
      'INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status) VALUES (?, ?, ?, ?, ?, ?)',
      [schoolId, title, description || null, amount_needed || null, amount_funded || 0, status || 'open']
    );
    const rows = await query('SELECT * FROM school_needs WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async updateNeed(schoolId, needId, data) {
    const fields = [];
    const params = [];
    const allowed = ['title', 'description', 'amount_needed', 'amount_funded', 'status'];
    for (const key of allowed) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); params.push(data[key]); }
    }
    if (!fields.length) return null;
    params.push(needId, schoolId);
    await query(`UPDATE school_needs SET ${fields.join(', ')} WHERE id = ? AND school_id = ?`, params);
    const rows = await query('SELECT * FROM school_needs WHERE id = ?', [needId]);
    return rows[0] || null;
  }

  static async deleteNeed(schoolId, needId) {
    await query('DELETE FROM school_needs WHERE id = ? AND school_id = ?', [needId, schoolId]);
  }
}

module.exports = School;
