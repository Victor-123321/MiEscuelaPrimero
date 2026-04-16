'use strict';

const footerService = require('../services/footerService');
const { successResponse } = require('../utils/formatters');

function adminContext(req) {
  return { userId: req.user?.user_id, ip: req.ip, userAgent: req.get('user-agent') };
}

async function getAllFooterContent(req, res, next) {
  try {
    const content = await footerService.getAllFooterContent();
    return successResponse(res, content, 'Contenido del pie de página obtenido exitosamente');
  } catch (err) {
    return next(err);
  }
}

async function updateFooterContent(req, res, next) {
  try {
    const updated = await footerService.updateFooterContent(
      req.params.contentKey,
      req.body.content_value,
      adminContext(req)
    );
    return successResponse(res, updated, 'Contenido actualizado exitosamente');
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAllFooterContent, updateFooterContent };
