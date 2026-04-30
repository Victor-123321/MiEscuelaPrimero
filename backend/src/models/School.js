'use strict';

const { query } = require('../config/database');

class School {
  static async findAll({ limit = 20, offset = 0, municipio, nivel_educativo, search, sortBy = 'created_at', sortOrder = 'desc' } = {}) {
    const allowedSortFields = ['id', 'escuela', 'municipio', 'estudiantes', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const conditions = ['s.status = ?'];
    const params = ['active'];

    if (municipio) { conditions.push('s.municipio = ?'); params.push(municipio); }
    if (nivel_educativo) { conditions.push('s.nivel_educativo = ?'); params.push(nivel_educativo); }
    if (search) {
      conditions.push('(s.escuela LIKE ? OR s.municipio LIKE ?)');
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
      if (school.needs.length > 0) {
        const cubiertas = school.needs.filter(n => n.estado === 'Cubierto').length;
        school.funding_pct = Math.round((cubiertas / school.needs.length) * 100);
      } else {
        school.funding_pct = 0;
      }
      school.urgent = school.needs.some(n => n.estado === 'Aun no cubierto');
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
    return query('SELECT * FROM school_needs WHERE school_id = ? ORDER BY categoria, subcategoria ASC', [schoolId]);
  }

  static async create(data) {
    const { municipio, plantel, escuela, personal_escolar, estudiantes, nivel_educativo, cct, modalidad, turno, sostenimiento, direccion, ubicacion, status, school_image_url } = data;
    const result = await query(
      `INSERT INTO schools (municipio, plantel, escuela, personal_escolar, estudiantes, nivel_educativo, cct, modalidad, turno, sostenimiento, direccion, ubicacion, status, school_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [municipio, plantel || null, escuela, personal_escolar || null, estudiantes || null, nivel_educativo || null, cct || null, modalidad || null, turno || null, sostenimiento || null, direccion || null, ubicacion || null, status || 'active', school_image_url || null]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    const allowed = ['municipio', 'plantel', 'escuela', 'personal_escolar', 'estudiantes', 'nivel_educativo', 'cct', 'modalidad', 'turno', 'sostenimiento', 'direccion', 'ubicacion', 'status', 'school_image_url'];
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
    await query('UPDATE schools SET status = "inactive" WHERE id = ?', [id]);
  }

  // --- Needs CRUD ---
  static async addNeed(schoolId, data) {
    const { categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles } = data;
    const result = await query(
      'INSERT INTO school_needs (school_id, categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [schoolId, categoria, subcategoria || null, propuesta, cantidad || null, unidad || null, estado || 'Aun no cubierto', detalles || null]
    );
    const rows = await query('SELECT * FROM school_needs WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async updateNeed(schoolId, needId, data) {
    const fields = [];
    const params = [];
    const allowed = ['categoria', 'subcategoria', 'propuesta', 'cantidad', 'unidad', 'estado', 'detalles'];
    for (const key of allowed) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); params.push(data[key]); }
    }

    if (!fields.length) {
      const rows = await query('SELECT * FROM school_needs WHERE id = ? AND school_id = ?', [needId, schoolId]);
      return rows[0];
    }

    params.push(needId, schoolId);
    await query(`UPDATE school_needs SET ${fields.join(', ')} WHERE id = ? AND school_id = ?`, params);
    const rows = await query('SELECT * FROM school_needs WHERE id = ?', [needId]);
    return rows[0];
  }

  static async deleteNeed(schoolId, needId) {
    await query('DELETE FROM school_needs WHERE id = ? AND school_id = ?', [needId, schoolId]);
  }

  static async upsertByEscuela(data) {
    const rows = await query('SELECT id FROM schools WHERE escuela = ? AND municipio = ?', [data.escuela, data.municipio]);
    if (rows.length) {
      await query(
        'UPDATE schools SET plantel=?,personal_escolar=?,estudiantes=?,nivel_educativo=?,cct=?,modalidad=?,turno=?,sostenimiento=?,direccion=?,ubicacion=?,status="active",updated_at=NOW() WHERE id=?',
        [data.plantel, data.personal_escolar, data.estudiantes, data.nivel_educativo, data.cct, data.modalidad, data.turno, data.sostenimiento, data.direccion, data.ubicacion, rows[0].id]
      );
      return rows[0].id;
    }
    const result = await query(
      'INSERT INTO schools (municipio,plantel,escuela,personal_escolar,estudiantes,nivel_educativo,cct,modalidad,turno,sostenimiento,direccion,ubicacion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [data.municipio, data.plantel, data.escuela, data.personal_escolar, data.estudiantes, data.nivel_educativo, data.cct, data.modalidad, data.turno, data.sostenimiento, data.direccion, data.ubicacion]
    );
    return result.insertId;
  }

  static async replaceNeeds(schoolId, needs) {
    await query('DELETE FROM school_needs WHERE school_id = ?', [schoolId]);
    for (const n of needs) {
      await query(
        'INSERT INTO school_needs (school_id,categoria,subcategoria,propuesta,cantidad,unidad,estado,detalles) VALUES (?,?,?,?,?,?,?,?)',
        [schoolId, n.categoria, n.subcategoria || null, n.propuesta, n.cantidad || null, n.unidad || null, n.estado, n.detalles || null]
      );
    }
  }

  // Distinct values for filters
  static async getMunicipios() {
    const rows = await query('SELECT DISTINCT municipio FROM schools WHERE status="active" ORDER BY municipio ASC');
    return rows.map(r => r.municipio);
  }

  static async getNiveles() {
    const rows = await query('SELECT DISTINCT nivel_educativo FROM schools WHERE nivel_educativo IS NOT NULL AND status="active" ORDER BY nivel_educativo ASC');
    return rows.map(r => r.nivel_educativo);
  }

  static async getCategories() {
    const rows = await query('SELECT DISTINCT categoria FROM school_needs WHERE categoria IS NOT NULL ORDER BY categoria ASC');
    return rows.map(r => r.categoria);
  }
}

module.exports = School;
