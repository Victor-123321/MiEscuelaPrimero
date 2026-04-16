'use strict';

const statsService = require('../services/statsService');
const { successResponse } = require('../utils/formatters');

function adminContext(req) {
  return { userId: req.user?.user_id, ip: req.ip, userAgent: req.get('user-agent') };
}

async function getAllStats(req, res, next) {
  try {
    const stats = await statsService.getAllStats();
    return successResponse(res, stats, 'Indicadores obtenidos exitosamente');
  } catch (err) {
    return next(err);
  }
}

async function updateStat(req, res, next) {
  try {
    const stat = await statsService.updateStat(req.params.statKey, req.body, adminContext(req));
    return successResponse(res, stat, 'Indicador actualizado exitosamente');
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAllStats, updateStat };
