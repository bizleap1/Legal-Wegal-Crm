import { prisma } from '@crm/database';
import { CreateActivitySchema } from '@crm/shared';
import { NotFoundError } from '../../utils/errors.js';
export async function addActivity(req, res, next) {
  try {
    const leadId = req.params.id;
    const user = req.user;
    const validated = CreateActivitySchema.parse(req.body);
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId
      }
    });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
    const activity = await prisma.leadActivity.create({
      data: {
        leadId,
        actorUserId: user.id,
        activityType: validated.activityType,
        direction: validated.direction,
        subject: validated.subject,
        body: validated.body,
        occurredAt: validated.occurredAt ? new Date(validated.occurredAt) : new Date(),
        metadata: validated.metadata ? JSON.stringify(validated.metadata) : null
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // If activity was a call or meeting, update lead status if it was still 'new'
    if ((validated.activityType === 'call' || validated.activityType === 'meeting') && lead.status === 'new') {
      await prisma.lead.update({
        where: {
          id: leadId
        },
        data: {
          status: 'contacted'
        }
      });
    }
    return res.status(201).json({
      status: 'success',
      data: activity
    });
  } catch (err) {
    next(err);
  }
}
export async function getLeadActivities(req, res, next) {
  try {
    const leadId = req.params.id;
    const activities = await prisma.leadActivity.findMany({
      where: {
        leadId
      },
      orderBy: {
        occurredAt: 'desc'
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        feedback: true
      }
    });
    return res.status(200).json({
      status: 'success',
      data: activities
    });
  } catch (err) {
    next(err);
  }
}