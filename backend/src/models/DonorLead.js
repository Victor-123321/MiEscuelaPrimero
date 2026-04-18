'use strict';

const { query } = require('../config/database');

class DonorLead {
  static async create(data) {
    const {
      nombre_completo, tipo_instancia, tipo_instancia_otro, nombre_instancia,
      email, celular, municipio_estado, acepta_privacidad,
      tipo_donativo, tipo_donativo_otro, escuelas_destino,
      tema_formacion, publico_dirigido, num_horas_sesiones, archivo_propuesta_url,
      articulo_donar, cantidad_articulos, opcion_flete, direccion_recoleccion, archivo_articulos_url,
      descripcion_apoyo, archivo_apoyo_url,
    } = data;

    const result = await query(
      `INSERT INTO donor_leads (
        nombre_completo, tipo_instancia, tipo_instancia_otro, nombre_instancia,
        email, celular, municipio_estado, acepta_privacidad,
        tipo_donativo, tipo_donativo_otro, escuelas_destino,
        tema_formacion, publico_dirigido, num_horas_sesiones, archivo_propuesta_url,
        articulo_donar, cantidad_articulos, opcion_flete, direccion_recoleccion, archivo_articulos_url,
        descripcion_apoyo, archivo_apoyo_url, status
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'nuevo')`,
      [
        nombre_completo, tipo_instancia, tipo_instancia_otro || null, nombre_instancia || null,
        email, celular || null, municipio_estado || null, acepta_privacidad ? 1 : 0,
        tipo_donativo, tipo_donativo_otro || null,
        escuelas_destino ? JSON.stringify(escuelas_destino) : null,
        tema_formacion || null, publico_dirigido || null, num_horas_sesiones || null, archivo_propuesta_url || null,
        articulo_donar || null, cantidad_articulos || null, opcion_flete || null, direccion_recoleccion || null, archivo_articulos_url || null,
        descripcion_apoyo || null, archivo_apoyo_url || null,
      ]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM donor_leads WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findAll({ limit = 50, offset = 0, status, tipo_donativo } = {}) {
    const conditions = [];
    const params = [];
    if (status) { conditions.push('status = ?'); params.push(status); }
    if (tipo_donativo) { conditions.push('tipo_donativo = ?'); params.push(tipo_donativo); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [[{ total }], rows] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM donor_leads ${where}`, params),
      query(`SELECT * FROM donor_leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]),
    ]);
    return { leads: rows, total };
  }

  static async updateStatus(id, status) {
    await query('UPDATE donor_leads SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }
}

module.exports = DonorLead;
