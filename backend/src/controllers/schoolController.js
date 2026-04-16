'use strict';

const schoolService = require('../services/schoolService');
const { successResponse, paginatedResponse } = require('../utils/formatters');

function adminContext(req) {
  return { userId: req.user?.user_id, ip: req.ip, userAgent: req.get('user-agent') };
}

async function listSchools(req, res, next) {
  try {
    const { schools, pagination } = await schoolService.listSchools(req.query);
    return paginatedResponse(res, schools, pagination, 'Escuelas obtenidas exitosamente');
  } catch (err) {
    return next(err);
  }
}

async function getSchool(req, res, next) {
  try {
    const school = await schoolService.getSchool(parseInt(req.params.id, 10));
    return successResponse(res, school, 'Escuela obtenida exitosamente');
  } catch (err) {
    return next(err);
  }
}

async function createSchool(req, res, next) {
  try {
    const school = await schoolService.createSchool(req.body, adminContext(req));
    return successResponse(res, school, 'Escuela creada exitosamente', 201);
  } catch (err) {
    return next(err);
  }
}

async function updateSchool(req, res, next) {
  try {
    const school = await schoolService.updateSchool(parseInt(req.params.id, 10), req.body, adminContext(req));
    return successResponse(res, school, 'Escuela actualizada exitosamente');
  } catch (err) {
    return next(err);
  }
}

async function deleteSchool(req, res, next) {
  try {
    await schoolService.deleteSchool(parseInt(req.params.id, 10), adminContext(req));
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function addNeed(req, res, next) {
  try {
    const need = await schoolService.addNeed(parseInt(req.params.id, 10), req.body, adminContext(req));
    return successResponse(res, need, 'Necesidad agregada exitosamente', 201);
  } catch (err) {
    return next(err);
  }
}

async function updateNeed(req, res, next) {
  try {
    const need = await schoolService.updateNeed(
      parseInt(req.params.id, 10),
      parseInt(req.params.needId, 10),
      req.body,
      adminContext(req)
    );
    return successResponse(res, need, 'Necesidad actualizada exitosamente');
  } catch (err) {
    return next(err);
  }
}

async function deleteNeed(req, res, next) {
  try {
    await schoolService.deleteNeed(parseInt(req.params.id, 10), parseInt(req.params.needId, 10), adminContext(req));
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { listSchools, getSchool, createSchool, updateSchool, deleteSchool, addNeed, updateNeed, deleteNeed };
