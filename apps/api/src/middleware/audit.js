import { prisma } from '@crm/database';
import { logger } from '../utils/logger.js';
export async function recordAuditLog(params) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: params.actorUserId || null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        before: params.before ? JSON.stringify(params.before) : null,
        after: params.after ? JSON.stringify(params.after) : null,
        ipAddress: params.ipAddress || null
      }
    });
  } catch (err) {
    logger.error('Failed to write audit log', err);
  }
}