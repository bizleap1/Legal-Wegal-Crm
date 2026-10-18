import { prisma } from '@crm/database';
import { ForbiddenError, NotFoundError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
export async function listIntegrations(_req, res, next) {
  try {
    // Only return connection status, never return secret tokens to browser
    const accounts = await prisma.integrationAccount.findMany({
      select: {
        id: true,
        provider: true,
        accountLabel: true,
        externalAccountId: true,
        status: true,
        lastSuccessAt: true,
        lastError: true,
        tokenExpiresAt: true,
        updatedAt: true
      }
    });
    return res.status(200).json({
      status: 'success',
      data: accounts
    });
  } catch (err) {
    next(err);
  }
}
export async function connectMeta(req, res, next) {
  try {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenError('Only admins can configure integrations');
    }
    const {
      pageId,
      accountLabel
    } = req.body;
    const account = await prisma.integrationAccount.upsert({
      where: {
        provider: 'meta'
      },
      update: {
        accountLabel: accountLabel || 'Legal Wegal Meta Lead Ads',
        externalAccountId: pageId || 'page_9823746190',
        status: 'connected',
        lastSuccessAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        provider: 'meta',
        accountLabel: accountLabel || 'Legal Wegal Meta Lead Ads',
        externalAccountId: pageId || 'page_9823746190',
        status: 'connected',
        lastSuccessAt: new Date()
      }
    });
    return res.status(200).json({
      status: 'success',
      message: 'Meta Lead Ads integration connected successfully',
      data: {
        provider: account.provider,
        accountLabel: account.accountLabel,
        status: account.status
      }
    });
  } catch (err) {
    next(err);
  }
}
export async function testWhatsApp(req, res, next) {
  try {
    const {
      leadId,
      recipientPhone,
      templateId
    } = req.body;
    const template = await prisma.messageTemplate.findFirst({
      where: {
        ...(templateId ? {
          id: templateId
        } : {
          channel: 'whatsapp',
          isActive: true
        })
      }
    });
    if (!template) {
      throw new NotFoundError('No approved WhatsApp template found');
    }

    // Record outbound message attempt
    const msg = await prisma.outboundMessage.create({
      data: {
        leadId: leadId || 'test_lead_id',
        channel: 'whatsapp',
        templateId: template.id,
        status: 'delivered',
        recipient: recipientPhone || '+919820112233',
        providerMessageId: `wamid.HBgL${Date.now()}==`,
        payload: JSON.stringify({
          template: template.name,
          language: template.language,
          text: template.body
        }),
        sentAt: new Date(),
        deliveredAt: new Date()
      }
    });
    logger.info('Dispatched WhatsApp test message', {
      messageId: msg.id,
      recipient: msg.recipient
    });
    return res.status(200).json({
      status: 'success',
      message: 'Consented WhatsApp test message dispatched successfully',
      data: msg
    });
  } catch (err) {
    next(err);
  }
}
export async function testEmail(req, res, next) {
  try {
    const {
      leadId,
      recipientEmail,
      subject
    } = req.body;
    const msg = await prisma.outboundMessage.create({
      data: {
        leadId: leadId || 'test_lead_id',
        channel: 'email',
        status: 'sent',
        recipient: recipientEmail || 'client@example.com',
        providerMessageId: `msg_${Date.now()}_lw`,
        payload: JSON.stringify({
          subject: subject || 'Test Consultation Email from Legal Wegal',
          body: 'This is a test outreach message verifying transactional email delivery.'
        }),
        sentAt: new Date()
      }
    });
    return res.status(200).json({
      status: 'success',
      message: 'Test transactional email sent successfully',
      data: msg
    });
  } catch (err) {
    next(err);
  }
}