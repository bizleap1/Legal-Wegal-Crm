import { prisma } from '@crm/database';
import { CreateLeadSchema, UpdateLeadSchema } from '@crm/shared';
import { ingestOrUpdateLead } from './leads.service.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';
import { recordAuditLog } from '../../middleware/audit.js';
export async function listLeads(req, res, next) {
  try {
    const user = req.user;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;
    const {
      status,
      ownerId,
      source,
      campaign,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    const where = {};

    // Role-based scoping: Salesperson only views assigned leads unless query specifies
    if (user.role === 'salesperson') {
      where.ownerUserId = user.id;
    } else if (ownerId) {
      where.ownerUserId = ownerId;
    }
    if (status) {
      where.status = status;
    }
    if (source) {
      where.sourceType = source;
    }
    if (campaign) {
      where.campaign = {
        campaignName: {
          contains: campaign
        }
      };
    }
    if (search) {
      const q = search.trim();
      where.OR = [{
        firstName: {
          contains: q
        }
      }, {
        lastName: {
          contains: q
        }
      }, {
        emailNormalized: {
          contains: q
        }
      }, {
        phoneE164: {
          contains: q
        }
      }, {
        company: {
          contains: q
        }
      }, {
        requirement: {
          contains: q
        }
      }];
    }
    const [total, leads] = await Promise.all([prisma.lead.count({
      where
    }), prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        source: true,
        campaign: true,
        _count: {
          select: {
            activities: true,
            followupTasks: true
          }
        }
      }
    })]);
    const formattedLeads = leads.map(l => ({
      ...l,
      activitiesCount: l._count.activities,
      tasksCount: l._count.followupTasks
    }));
    return res.status(200).json({
      status: 'success',
      data: formattedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}
export async function createLead(req, res, next) {
  try {
    const validated = CreateLeadSchema.parse(req.body);
    const result = await ingestOrUpdateLead({
      ...validated,
      actorUserId: req.user?.id
    });
    return res.status(201).json({
      status: 'success',
      data: result.lead,
      isDuplicate: result.isDuplicate
    });
  } catch (err) {
    next(err);
  }
}
export async function getLeadById(req, res, next) {
  try {
    const id = req.params.id;
    const user = req.user;
    const lead = await prisma.lead.findUnique({
      where: {
        id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        source: true,
        campaign: true,
        followupTasks: {
          orderBy: {
            dueAt: 'asc'
          },
          include: {
            assignedUser: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        outboundMessages: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
    if (user.role === 'salesperson' && lead.ownerUserId !== user.id) {
      throw new ForbiddenError('You do not have permission to view this lead');
    }
    return res.status(200).json({
      status: 'success',
      data: lead
    });
  } catch (err) {
    next(err);
  }
}
export async function updateLead(req, res, next) {
  try {
    const id = req.params.id;
    const user = req.user;
    const validated = UpdateLeadSchema.parse(req.body);
    const existing = await prisma.lead.findUnique({
      where: {
        id
      }
    });
    if (!existing) {
      throw new NotFoundError('Lead not found');
    }
    if (user.role === 'salesperson' && existing.ownerUserId !== user.id) {
      throw new ForbiddenError('You do not have permission to edit this lead');
    }

    // Check if status changed
    const statusChanged = validated.status && validated.status !== existing.status;
    const now = new Date();
    const updated = await prisma.lead.update({
      where: {
        id
      },
      data: {
        ...validated,
        wonAt: validated.status === 'won' ? now : existing.wonAt,
        lostReason: validated.status === 'lost' ? validated.lostReason || existing.lostReason : existing.lostReason,
        updatedAt: now
      },
      include: {
        owner: true,
        source: true,
        campaign: true
      }
    });

    // If status changed, record timeline activity
    if (statusChanged) {
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          actorUserId: user.id,
          activityType: 'status_change',
          direction: 'outbound',
          subject: `Status changed to ${validated.status?.toUpperCase()}`,
          body: `Lead status updated from ${existing.status} to ${validated.status}${validated.lostReason ? ` (Reason: ${validated.lostReason})` : ''}`,
          occurredAt: now
        }
      });

      // If Won or Lost, cancel remaining pending follow-up tasks per spec!
      if (validated.status === 'won' || validated.status === 'lost') {
        await prisma.followupTask.updateMany({
          where: {
            leadId: id,
            status: 'pending'
          },
          data: {
            status: 'cancelled',
            outcome: `Cancelled due to lead marked ${validated.status}`
          }
        });
      }
    }
    await recordAuditLog({
      actorUserId: user.id,
      action: 'LEAD_UPDATED',
      entityType: 'leads',
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
export async function assignLead(req, res, next) {
  try {
    const id = req.params.id;
    const {
      ownerUserId
    } = req.body;
    const user = req.user;
    if (user.role === 'salesperson') {
      throw new ForbiddenError('Only admins and managers can reassign leads');
    }
    const lead = await prisma.lead.findUnique({
      where: {
        id
      }
    });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
    const newOwner = await prisma.user.findUnique({
      where: {
        id: ownerUserId
      }
    });
    if (!newOwner) {
      throw new NotFoundError('Target user not found');
    }
    const updated = await prisma.lead.update({
      where: {
        id
      },
      data: {
        ownerUserId
      },
      include: {
        owner: true
      }
    });

    // Update pending follow-up tasks owner
    await prisma.followupTask.updateMany({
      where: {
        leadId: id,
        status: 'pending'
      },
      data: {
        assignedUserId: ownerUserId
      }
    });

    // Record activity
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        actorUserId: user.id,
        activityType: 'assignment',
        direction: 'outbound',
        subject: `Lead Assigned to ${newOwner.name}`,
        body: `Lead ownership transferred to ${newOwner.name} (${newOwner.role}) by ${user.name}.`,
        occurredAt: new Date()
      }
    });
    await recordAuditLog({
      actorUserId: user.id,
      action: 'LEAD_REASSIGNED',
      entityType: 'leads',
      entityId: id,
      before: {
        previousOwnerId: lead.ownerUserId
      },
      after: {
        newOwnerId: ownerUserId
      }
    });
    return res.status(200).json({
      status: 'success',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}
export async function recordFeedback(req, res, next) {
  try {
    const id = req.params.id;
    const {
      rating,
      category,
      comments,
      activityId
    } = req.body;
    const user = req.user;
    const feedback = await prisma.feedback.create({
      data: {
        leadId: id,
        activityId: activityId || null,
        rating: rating || 5,
        category: category || 'General',
        comments: comments || '',
        capturedBy: user.id
      }
    });
    return res.status(201).json({
      status: 'success',
      data: feedback
    });
  } catch (err) {
    next(err);
  }
}