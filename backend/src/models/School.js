'use strict';

const { query } = require('../config/database');

class School {
  static async findAll({ limit = 20, offset = 0, municipality, category, type, urgent, search, sortBy = 'name', sortOrder = 'asc' } = {}) {
    const allowedSort = ['id', 'name', 'municipality', 'students', 'created_at'];
    const safeSortBy = allowedSort.includes(sortBy) ? sortBy : 'name';
    const safeSortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC';

    const conditions = ['s.status = ?'];
    const params = ['active'];

    if (municipality) { conditions.push('s.municipality = ?'); params.push(municipality); }
    if (category) { conditions.push('EXISTS (SELECT 1 FROM school_needs sn WHERE sn.school_id = s.id AND sn.categoria = ?)'); params.push(category); }
    if (type) { conditions.push('s.type = ?'); params.push(type); }
    if (urgent !== null && urgent !== undefined) { conditions.push('s.urgent = ?'); params.push(urgent); }
    if (search) {
      conditions.push('(s.name LIKE ? OR s.municipality LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like);
    }

    const where = conditions.join(' AND ');
    const [[{ total }]] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM schools s WHERE ${where}`, params),
    ]);

    const schools = await query(
      `SELECT s.* FROM schools s WHERE ${where} ORDER BY s.${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), parseInt(offset, 10)]
    );

    for (const school of schools) {
      school.needs = await School.findNeeds(school.id);
      // Compute funding_pct from needs: % of needs that are 'Cubierto'
      if (school.needs.length > 0) {
        const cubiertas = school.needs.filter(n => n.estado === 'Cubierto').length;
        school.funding_pct = Math.round((cubiertas / school.needs.length) * 100);
      } else {
        school.funding_pct = 0;
      }
      // Compute urgent: has any need with 'Aun no cubierto'
      school.urgent = school.urgent || school.needs.some(n => n.estado === 'Aun no cubierto');
      // Compute category from needs
      school.categories = [...new Set(school.needs.map(n => n.categoria).filter(Boolean))];
    }

    return { schools, total };
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM schools WHERE id = ? AND status = "active"', [id]);
    if (!rows.length) return null;
    const school = rows[0];
    school.needs = await School.findNeeds(id);
    if (school.needs.length > 0) {
      const cubiertas = school.needs.filter(n => n.estado === 'Cubierto').length;
      school.funding_pct = Math.round((cubiertas / school.needs.length) * 100);
    } else {
      school.funding_pct = 0;
    }
    school.categories = [...new Set(school.needs.map(n => n.categoria).filter(Boolean))];
    return school;
  }

  static async findNeeds(schoolId) {
    return query(
      'SELECT * FROM school_needs WHERE school_id = ? ORDER BY categoria ASC, subcategoria ASC, propuesta ASC',
      [schoolId]
    );
  }

  static async create(data) {
    const { name, municipality, type, description, students, teachers, urgent, status, school_image_url } = data;
    const result = await query(
      `INSERT INTO schools (name, municipality, type, description, students, teachers, urgent, status, school_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, municipality, type || null, description || null,
       students || null, teachers || null, urgent ? 1 : 0,
       status || 'active', school_image_url || null]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const allowed = ['name', 'municipality', 'type', 'description', 'students', 'teachers', 'urgent', 'status', 'school_image_url'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (!fields.length) return this.findById(id);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await query(`UPDATE schools SET ${setClause} WHERE id = ?`, [...fields.map(f => data[f]), id]);
    return this.findById(id);
  }

  static async softDelete(id) {
    await query('UPDATE schools SET status = "inactive" WHERE id = ?', [id]);
  }

  // --- Needs CRUD ---
  static async addNeed(schoolId, data) {
    const { categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles } = data;
    const result = await query(
      `INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [schoolId, categoria || null, subcategoria || null, propuesta || null,
       cantidad || null, unidad || null, estado || null, detalles || null]
    );
    const rows = await query('SELECT * FROM school_needs WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async updateNeed(schoolId, needId, data) {
    const allowed = ['categoria', 'subcategoria', 'propuesta', 'cantidad', 'unidad', 'estado', 'detalles'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (!fields.length) {
      const rows = await query('SELECT * FROM school_needs WHERE id = ? AND school_id = ?', [needId, schoolId]);
      return rows[0];
    }
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await query(`UPDATE school_needs SET ${setClause} WHERE id = ? AND school_id = ?`, [...fields.map(f => data[f]), needId, schoolId]);
    const rows = await query('SELECT * FROM school_needs WHERE id = ?', [needId]);
    return rows[0];
  }

  static async deleteNeed(schoolId, needId) {
    await query('DELETE FROM school_needs WHERE id = ? AND school_id = ?', [needId, schoolId]);
  }

  // Distinct values for filters
  static async getMunicipalities() {
    const rows = await query('SELECT DISTINCT municipality FROM schools WHERE status="active" ORDER BY municipality ASC');
    return rows.map(r => r.municipality);
  }

  static async getCategories() {
    const rows = await query('SELECT DISTINCT categoria FROM school_needs WHERE categoria IS NOT NULL ORDER BY categoria ASC');
    return rows.map(r => r.categoria);
  }
}

module.exports = School;
