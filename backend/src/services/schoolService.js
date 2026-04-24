'use strict';

const School = require('../models/School');
const AuditLog = require('../models/AuditLog');
const { NotFoundError } = require('../middleware/errorHandler');
const { buildPagination } = require('../utils/helpers');
const MESSAGES = require('../utils/errorMessages');

async function listSchools(queryParams) {
  const { limit = 20, offset = 0, municipio, nivel_educativo, search, sort_by, sort_order } = queryParams;

  const { schools, total } = await School.findAll({
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    municipio,
    nivel_educativo,
    search,
    sortBy: sort_by,
    sortOrder: sort_order,
  });

  const pagination = buildPagination(limit, offset, total);
  return { schools, pagination };
}

async function getSchool(id) {
  const school = await School.findById(id);
  if (!school) throw new NotFoundError(MESSAGES.SCHOOL.NOT_FOUND);
  return school;
}

async function createSchool(data, adminContext) {
  const school = await School.create(data);
  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'create_school',
    entityType: 'school',
    entityId: school.id,
    changes: { created: data },
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
  return school;
}

async function updateSchool(id, data, adminContext) {
  const existing = await School.findById(id);
  if (!existing) throw new NotFoundError(MESSAGES.SCHOOL.NOT_FOUND);

  const updated = await School.update(id, data);
  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'update_school',
    entityType: 'school',
    entityId: id,
    changes: { before: existing, after: data },
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
  return updated;
}

async function deleteSchool(id, adminContext) {
  const existing = await School.findById(id);
  if (!existing) throw new NotFoundError(MESSAGES.SCHOOL.NOT_FOUND);

  await School.softDelete(id);
  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'delete_school',
    entityType: 'school',
    entityId: id,
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
}

async function addNeed(schoolId, data, adminContext) {
  const school = await School.findById(schoolId);
  if (!school) throw new NotFoundError(MESSAGES.SCHOOL.NOT_FOUND);

  const need = await School.addNeed(schoolId, data);
  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'create_need',
    entityType: 'school_need',
    entityId: need.id,
    changes: { school_id: schoolId, created: data },
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
  return need;
}

async function updateNeed(schoolId, needId, data, adminContext) {
  const school = await School.findById(schoolId);
  if (!school) throw new NotFoundError(MESSAGES.SCHOOL.NOT_FOUND);

  const need = await School.updateNeed(schoolId, needId, data);
  if (!need) throw new NotFoundError(MESSAGES.NEED.NOT_FOUND);

  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'update_need',
    entityType: 'school_need',
    entityId: needId,
    changes: data,
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
  return need;
}

async function deleteNeed(schoolId, needId, adminContext) {
  const school = await School.findById(schoolId);
  if (!school) throw new NotFoundError(MESSAGES.SCHOOL.NOT_FOUND);

  await School.deleteNeed(schoolId, needId);
  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'delete_need',
    entityType: 'school_need',
    entityId: needId,
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
}

module.exports = { listSchools, getSchool, createSchool, updateSchool, deleteSchool, addNeed, updateNeed, deleteNeed };
