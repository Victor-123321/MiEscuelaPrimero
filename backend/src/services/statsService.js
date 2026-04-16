'use strict';

const Stat = require('../models/Stat');
const AuditLog = require('../models/AuditLog');
const { NotFoundError } = require('../middleware/errorHandler');
const MESSAGES = require('../utils/errorMessages');

async function getAllStats() {
  return Stat.findAll();
}

async function updateStat(statKey, data, adminContext) {
  const existing = await Stat.findByKey(statKey);
  if (!existing) throw new NotFoundError(MESSAGES.STAT.NOT_FOUND);

  const updated = await Stat.update(statKey, data, adminContext.userId);
  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'update_stats',
    entityType: 'stats',
    entityId: existing.id,
    changes: { stat_key: statKey, before: existing.stat_value, after: data.stat_value },
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
  return updated;
}

module.exports = { getAllStats, updateStat };
