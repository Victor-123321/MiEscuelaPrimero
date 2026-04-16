'use strict';

const FooterContent = require('../models/FooterContent');
const AuditLog = require('../models/AuditLog');
const { NotFoundError } = require('../middleware/errorHandler');
const MESSAGES = require('../utils/errorMessages');

async function getAllFooterContent() {
  return FooterContent.findAll();
}

async function updateFooterContent(contentKey, contentValue, adminContext) {
  const existing = await FooterContent.findByKey(contentKey);
  if (!existing) throw new NotFoundError(MESSAGES.FOOTER.NOT_FOUND);

  const updated = await FooterContent.update(contentKey, contentValue, adminContext.userId);
  await AuditLog.create({
    adminId: adminContext.userId,
    action: 'update_footer',
    entityType: 'footer',
    entityId: existing.id,
    changes: { content_key: contentKey, before: existing.content_value, after: contentValue },
    ipAddress: adminContext.ip,
    userAgent: adminContext.userAgent,
  });
  return updated;
}

module.exports = { getAllFooterContent, updateFooterContent };
