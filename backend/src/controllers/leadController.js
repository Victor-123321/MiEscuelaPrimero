'use strict';

const DonorLead = require('../models/DonorLead');
const { successResponse, paginatedResponse } = require('../utils/formatters');
const { AppError } = require('../middleware/errorHandler');

async function createLead(req, res, next) {
  try {
    const { nombre_completo, email, tipo_instancia, tipo_donativo, acepta_privacidad } = req.body;
    if (!nombre_completo || !email || !tipo_instancia || !tipo_donativo) {
      throw new AppError('nombre_completo, email, tipo_instancia y tipo_donativo son requeridos.', 400);
    }
    if (!acepta_privacidad) {
      throw new AppError('Debes aceptar el aviso de privacidad.', 400);
    }
    const lead = await DonorLead.create(req.body);
    return successResponse(res, lead, 'Solicitud enviada exitosamente. Te contactaremos en menos de 48 horas.', 201);
  } catch (err) { return next(err); }
}

async function listLeads(req, res, next) {
  try {
    const { limit = 50, offset = 0, status, tipo_donativo } = req.query;
    const { leads, total } = await DonorLead.findAll({
      limit: parseInt(limit, 10), offset: parseInt(offset, 10), status, tipo_donativo,
    });
    return paginatedResponse(res, leads, { limit, offset, total, pages: Math.ceil(total / limit) }, 'Leads obtenidos');
  } catch (err) { return next(err); }
}

async function getLead(req, res, next) {
  try {
    const lead = await DonorLead.findById(parseInt(req.params.id, 10));
    if (!lead) throw new AppError('Lead no encontrado.', 404);
    return successResponse(res, lead, 'Lead obtenido');
  } catch (err) { return next(err); }
}

async function updateLeadStatus(req, res, next) {
  try {
    const { status } = req.body;
    const valid = ['nuevo', 'contactado', 'completado', 'cancelado'];
    if (!valid.includes(status)) throw new AppError('Status inválido.', 400);
    const lead = await DonorLead.updateStatus(parseInt(req.params.id, 10), status);
    return successResponse(res, lead, 'Status actualizado');
  } catch (err) { return next(err); }
}

module.exports = { createLead, listLeads, getLead, updateLeadStatus };
