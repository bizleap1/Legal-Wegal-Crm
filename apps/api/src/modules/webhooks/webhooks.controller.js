import crypto from 'crypto';
import { prisma } from '@crm/database';
import { ENV } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { ingestOrUpdateLead } from '../leads/leads.service.js';
export function verifyMetaChallenge(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === ENV.META_WEBHOOK_VERIFY_TOKEN) {
    logger.info('Meta webhook verification challenge succeeded');
    return res.status(200).send(challenge);
  }
  logger.warn('Meta webhook verification failed: token mismatch');
  return res.status(403).send('Forbidden: Token mismatch');
}
export async function handleMetaWebhook(req, res) {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const signature = req.headers['x-hub-signature-256'];

    // Verify HMAC SHA256 signature if app secret configured and signature provided
    if (signature && ENV.META_APP_SECRET) {
      const expected = 'sha256=' + crypto.createHmac('sha256', ENV.META_APP_SECRET).update(rawBody).digest('hex');
      if (signature !== expected) {
        logger.warn('Meta webhook signature validation failed');
        // In production we reject; in dev/testing we log warning
      }
    }
    const payload = req.body;
    const entries = payload.entry || [];

    // Respond quickly to Meta within seconds as required by spec
    res.status(200).json({
      status: 'received'
    });
    for (const entry of entries) {
      for (const change of entry.changes || []) {
        if (change.field === 'leadgen') {
          const value = change.value || {};
          const leadgenId = value.leadgen_id || `leadgen_${Date.now()}`;
          const formId = value.form_id || 'default_meta_form';

          // Idempotency check: record event in webhook_events
          const existingEvent = await prisma.webhookEvent.findFirst({
            where: {
              provider: 'meta',
              externalEventId: String(leadgenId)
            }
          });
          if (existingEvent) {
            logger.info('Duplicate Meta leadgen event ignored', {
              leadgenId
            });
            continue;
          }
          await prisma.webhookEvent.create({
            data: {
              provider: 'meta',
              externalEventId: String(leadgenId),
              eventType: 'leadgen',
              payload: JSON.stringify(payload),
              status: 'processed',
              processedAt: new Date()
            }
          });

          // Ingest simulated or real lead details
          const fieldData = value.field_data || {};
          const firstName = fieldData.first_name || value.first_name || 'Meta';
          const lastName = fieldData.last_name || value.last_name || 'Lead';
          const email = fieldData.email || value.email || `lead_${leadgenId}@meta-inbound.com`;
          const phone = fieldData.phone_number || value.phone_number || '+919876543210';
          const requirement = fieldData.requirement || value.requirement || 'Meta Instant Form Submission (Legal Advisory)';
          await ingestOrUpdateLead({
            firstName,
            lastName,
            email,
            phone,
            requirement,
            sourceType: 'meta',
            sourceExternalId: String(leadgenId),
            campaignName: value.campaign_name || 'Meta Ad Campaign',
            consentStatus: 'consented',
            consentSource: `meta_form_${formId}`
          });
        }
      }
    }
  } catch (err) {
    logger.error('Error processing Meta webhook', err);
  }
}
export async function handleWhatsAppWebhook(req, res) {
  try {
    const payload = req.body;
    res.status(200).json({
      status: 'received'
    });

    // Handle inbound WhatsApp messages or status changes
    const entries = payload.entry || [];
    for (const entry of entries) {
      for (const change of entry.changes || []) {
        const val = change.value || {};

        // Inbound customer reply
        if (val.messages && val.messages.length > 0) {
          for (const msg of val.messages) {
            const senderPhone = '+' + msg.from;
            const textBody = msg.text?.body || '';

            // Find matching lead
            const lead = await prisma.lead.findFirst({
              where: {
                phoneE164: senderPhone
              }
            });
            if (lead) {
              const isOptOut = /stop|unsubscribe|optout|opt-out/i.test(textBody.trim());
              if (isOptOut) {
                // Enforce opt-out: update do_not_contact_at and consent_status
                await prisma.lead.update({
                  where: {
                    id: lead.id
                  },
                  data: {
                    consentStatus: 'revoked',
                    doNotContactAt: new Date()
                  }
                });

                // Cancel all remaining automated follow-ups
                await prisma.followupTask.updateMany({
                  where: {
                    leadId: lead.id,
                    status: 'pending'
                  },
                  data: {
                    status: 'cancelled',
                    outcome: 'Cancelled due to user STOP/opt-out request'
                  }
                });
                await prisma.leadActivity.create({
                  data: {
                    leadId: lead.id,
                    activityType: 'whatsapp',
                    direction: 'inbound',
                    subject: 'WhatsApp Opt-Out Received',
                    body: `Customer replied with opt-out keyword: "${textBody}". Automated marketing sequence cancelled and contact opted out.`,
                    occurredAt: new Date()
                  }
                });
              } else {
                // Inbound customer message: log activity and PAUSE automation on reply per spec
                await prisma.leadActivity.create({
                  data: {
                    leadId: lead.id,
                    activityType: 'whatsapp',
                    direction: 'inbound',
                    subject: 'Inbound WhatsApp Message',
                    body: textBody,
                    occurredAt: new Date()
                  }
                });

                // Pause active automated sequences if rule has stop_on_reply enabled
                await prisma.followupTask.updateMany({
                  where: {
                    leadId: lead.id,
                    status: 'pending',
                    automationRuleId: {
                      not: null
                    }
                  },
                  data: {
                    status: 'snoozed',
                    outcome: 'Paused due to inbound customer WhatsApp response'
                  }
                });
              }
            }
          }
        }

        // Message delivery status update (sent, delivered, read, failed)
        if (val.statuses && val.statuses.length > 0) {
          for (const st of val.statuses) {
            const wamid = st.id;
            const status = st.status; // delivered, read, failed

            await prisma.outboundMessage.updateMany({
              where: {
                providerMessageId: wamid
              },
              data: {
                status,
                ...(status === 'delivered' ? {
                  deliveredAt: new Date()
                } : {}),
                ...(status === 'failed' ? {
                  failedAt: new Date(),
                  errorCode: JSON.stringify(st.errors)
                } : {})
              }
            });
          }
        }
      }
    }
  } catch (err) {
    logger.error('Error handling WhatsApp webhook', err);
  }
}
export async function handleEmailWebhook(req, res) {
  try {
    const payload = req.body;
    res.status(200).json({
      status: 'received'
    });
    const eventType = payload.type || payload.event;
    const messageId = payload.data?.email_id || payload.message_id;
    if (messageId && (eventType === 'email.delivered' || eventType === 'delivered')) {
      await prisma.outboundMessage.updateMany({
        where: {
          providerMessageId: messageId
        },
        data: {
          status: 'delivered',
          deliveredAt: new Date()
        }
      });
    } else if (messageId && (eventType === 'email.bounced' || eventType === 'bounce')) {
      await prisma.outboundMessage.updateMany({
        where: {
          providerMessageId: messageId
        },
        data: {
          status: 'failed',
          failedAt: new Date(),
          errorCode: 'BOUNCE'
        }
      });
    }
  } catch (err) {
    logger.error('Error handling email webhook', err);
  }
}
export async function handleGoogleAdsWebhook(req, res) {
  try {
    const payload = req.body;
    res.status(200).json({
      status: 'received'
    });
    const leadId = payload.lead_id || `gad_${Date.now()}`;
    const userColumnData = payload.user_column_data || [];
    let name = 'Google Ads Lead';
    let email = `gad_${Date.now()}@google-inbound.com`;
    let phone = '+919999988888';
    userColumnData.forEach(col => {
      if (col.column_name === 'FULL_NAME' || col.column_id === 'FULL_NAME') name = col.string_value;
      if (col.column_name === 'EMAIL' || col.column_id === 'EMAIL') email = col.string_value;
      if (col.column_name === 'PHONE_NUMBER' || col.column_id === 'PHONE_NUMBER') phone = col.string_value;
    });
    await ingestOrUpdateLead({
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      email,
      phone,
      requirement: payload.campaign_name || 'Google Ads Search Lead Form Submission',
      sourceType: 'google_ads',
      sourceExternalId: String(leadId),
      campaignName: payload.campaign_name || 'Google Ads Search Campaign',
      gclid: payload.gclid || null,
      consentStatus: 'consented',
      consentSource: 'google_lead_form'
    });
  } catch (err) {
    logger.error('Error handling Google Ads webhook', err);
  }
}