import { prisma } from '@crm/database';
import { CreateTaskSchema, UpdateTaskSchema } from '@crm/shared';
import { NotFoundError } from '../../utils/errors.js';
import { recordAuditLog } from '../../middleware/audit.js';
export async function listTasks(req, res, next) {
  try {
    const user = req.user;
    const {
      status,
      ownerId,
      dueFilter
    } = req.query;
    const where = {};
    if (user.role === 'salesperson') {
      where.assignedUserId = user.id;
    } else if (ownerId) {
      where.assignedUserId = ownerId;
    }
    if (status) {
      where.status = status;
    }
    const now = new Date();
    if (dueFilter === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      where.dueAt = {
        gte: startOfDay,
        lte: endOfDay
      };
    } else if (dueFilter === 'overdue') {
      where.dueAt = {
        lt: now
      };
      where.status = 'pending';
    } else if (dueFilter === 'upcoming') {
      where.dueAt = {
        gt: now
      };
    }
    const tasks = await prisma.followupTask.findMany({
      where,
      orderBy: {
        dueAt: 'asc'
      },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            phoneE164: true,
            emailNormalized: true,
            status: true,
            priority: true,
            sourceType: true
          }
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    return res.status(200).json({
      status: 'success',
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}
export async function createTask(req, res, next) {
  try {
    const user = req.user;
    const validated = CreateTaskSchema.parse(req.body);
    const task = await prisma.followupTask.create({
      data: {
        leadId: validated.leadId,
        assignedUserId: validated.assignedUserId || user.id,
        taskType: validated.taskType,
        dueAt: new Date(validated.dueAt),
        status: 'pending',
        outcome: validated.outcome || null
      },
      include: {
        lead: true,
        assignedUser: true
      }
    });
    return res.status(201).json({
      status: 'success',
      data: task
    });
  } catch (err) {
    next(err);
  }
}
export async function updateTask(req, res, next) {
  try {
    const id = req.params.id;
    const user = req.user;
    const validated = UpdateTaskSchema.parse(req.body);
    const existing = await prisma.followupTask.findUnique({
      where: {
        id
      },
      include: {
        lead: true
      }
    });
    if (!existing) {
      throw new NotFoundError('Task not found');
    }
    const completed = validated.status === 'completed';
    const now = new Date();
    const updated = await prisma.followupTask.update({
      where: {
        id
      },
      data: {
        status: validated.status || existing.status,
        dueAt: validated.dueAt ? new Date(validated.dueAt) : existing.dueAt,
        outcome: validated.outcome !== undefined ? validated.outcome : existing.outcome,
        completedAt: completed ? now : existing.completedAt
      },
      include: {
        lead: true,
        assignedUser: true
      }
    });
    if (completed) {
      await prisma.leadActivity.create({
        data: {
          leadId: existing.leadId,
          actorUserId: user.id,
          activityType: existing.taskType === 'call' ? 'call' : 'note',
          direction: 'outbound',
          subject: `Task Completed: ${existing.taskType.toUpperCase()}`,
          body: validated.outcome || 'Task marked as completed.',
          occurredAt: now
        }
      });
    }
    await recordAuditLog({
      actorUserId: user.id,
      action: 'TASK_UPDATED',
      entityType: 'followup_tasks',
      entityId: id,
      before: existing,
      after: updated
    });
    return res.status(200).json({
      status: 'success',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}