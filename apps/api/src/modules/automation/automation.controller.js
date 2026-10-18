import { prisma } from '@crm/database';
import { CreateAutomationRuleSchema } from '@crm/shared';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';
export async function listRules(_req, res, next) {
  try {
    const rules = await prisma.automationRule.findMany({
      orderBy: {
        offsetDays: 'asc'
      },
      include: {
        template: true
      }
    });
    return res.status(200).json({
      status: 'success',
      data: rules
    });
  } catch (err) {
    next(err);
  }
}
export async function createRule(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError('Only admins can create automation rules');
    }
    const validated = CreateAutomationRuleSchema.parse(req.body);
    const rule = await prisma.automationRule.create({
      data: {
        name: validated.name,
        triggerType: validated.triggerType,
        offsetDays: validated.offsetDays,
        channel: validated.channel,
        templateId: validated.templateId || null,
        enabled: validated.enabled,
        businessHoursOnly: validated.businessHoursOnly,
        stopOnReply: validated.stopOnReply,
        conditions: validated.conditions ? JSON.stringify(validated.conditions) : null
      },
      include: {
        template: true
      }
    });
    return res.status(201).json({
      status: 'success',
      data: rule
    });
  } catch (err) {
    next(err);
  }
}
export async function updateRule(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError('Only admins can update automation rules');
    }
    const id = req.params.id;
    const {
      name,
      enabled,
      offsetDays,
      channel,
      templateId,
      businessHoursOnly,
      stopOnReply
    } = req.body;
    const existing = await prisma.automationRule.findUnique({
      where: {
        id
      }
    });
    if (!existing) {
      throw new NotFoundError('Automation rule not found');
    }
    const updated = await prisma.automationRule.update({
      where: {
        id
      },
      data: {
        name: name !== undefined ? name : existing.name,
        enabled: enabled !== undefined ? enabled : existing.enabled,
        offsetDays: offsetDays !== undefined ? offsetDays : existing.offsetDays,
        channel: channel !== undefined ? channel : existing.channel,
        templateId: templateId !== undefined ? templateId : existing.templateId,
        businessHoursOnly: businessHoursOnly !== undefined ? businessHoursOnly : existing.businessHoursOnly,
        stopOnReply: stopOnReply !== undefined ? stopOnReply : existing.stopOnReply
      },
      include: {
        template: true
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
export async function listTemplates(_req, res, next) {
  try {
    const templates = await prisma.messageTemplate.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return res.status(200).json({
      status: 'success',
      data: templates
    });
  } catch (err) {
    next(err);
  }
}
export async function createTemplate(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError('Only admins can create templates');
    }
    const {
      channel,
      name,
      providerTemplateName,
      subject,
      body,
      language
    } = req.body;
    const template = await prisma.messageTemplate.create({
      data: {
        channel: channel || 'whatsapp',
        name,
        providerTemplateName: providerTemplateName || null,
        subject: subject || null,
        body,
        language: language || 'en',
        approvalStatus: 'approved',
        isActive: true
      }
    });
    return res.status(201).json({
      status: 'success',
      data: template
    });
  } catch (err) {
    next(err);
  }
}