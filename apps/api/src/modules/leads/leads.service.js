import { prisma } from '@crm/database';
import { normalizeEmail, normalizePhoneE164 } from '@crm/shared';
import { DEFAULT_FOLLOWUP_SEQUENCE } from '@crm/shared';
import { logger } from '../../utils/logger.js';
import { recordAuditLog } from '../../middleware/audit.js';
export async function ingestOrUpdateLead(input) {
  const emailNorm = normalizeEmail(input.email);
  const phoneE164 = normalizePhoneE164(input.phone);
  const sourceType = input.sourceType || 'manual';

  // 1. External ID Deduplication check (Meta leadgen ID, form ID, etc.)
  if (input.sourceExternalId) {
    const existingByExternal = await prisma.lead.findFirst({
      where: {
        sourceType,
        sourceExternalId: input.sourceExternalId
      },
      include: {
        owner: true,
        source: true,
        campaign: true
      }
    });
    if (existingByExternal) {
      logger.info('Duplicate external lead detected, updating existing lead', {
        leadId: existingByExternal.id,
        externalId: input.sourceExternalId
      });

      // Record activity noting duplicate submission
      await prisma.leadActivity.create({
        data: {
          leadId: existingByExternal.id,
          activityType: 'system',
          direction: 'inbound',
          subject: 'Duplicate Event Received',
          body: `Received duplicate webhook or submission with external ID ${input.sourceExternalId} from ${sourceType}. Payload merged.`,
          metadata: JSON.stringify(input)
        }
      });
      return {
        lead: existingByExternal,
        isDuplicate: true
      };
    }
  }

  // 2. Phone / Email Deduplication Check
  const existingByContact = await prisma.lead.findFirst({
    where: {
      OR: [{
        phoneE164
      }, {
        emailNormalized: emailNorm
      }]
    },
    include: {
      owner: true,
      source: true,
      campaign: true
    }
  });
  if (existingByContact) {
    logger.info('Matched existing lead by phone/email', {
      leadId: existingByContact.id,
      phone: phoneE164,
      email: emailNorm
    });

    // Update requirements or company if new information supplied
    const updated = await prisma.lead.update({
      where: {
        id: existingByContact.id
      },
      data: {
        company: input.company || existingByContact.company,
        requirement: input.requirement ? `${existingByContact.requirement || ''}\n[Update]: ${input.requirement}` : existingByContact.requirement,
        updatedAt: new Date()
      },
      include: {
        owner: true,
        source: true,
        campaign: true
      }
    });
    await prisma.leadActivity.create({
      data: {
        leadId: updated.id,
        activityType: 'system',
        direction: 'inbound',
        subject: `New Inquiry from Existing Contact (${sourceType})`,
        body: `Contact re-submitted inquiry via ${sourceType}. Requirement: "${input.requirement || 'N/A'}"`,
        metadata: JSON.stringify(input)
      }
    });
    return {
      lead: updated,
      isDuplicate: true,
      wasMerged: true
    };
  }

  // 3. Resolve or create campaign attribution
  let campaignId = null;
  if (input.campaignName || input.utmCampaign) {
    const campName = input.campaignName || input.utmCampaign || 'Unnamed Campaign';
    let camp = await prisma.campaign.findFirst({
      where: {
        campaignName: campName
      }
    });
    if (!camp) {
      camp = await prisma.campaign.create({
        data: {
          platform: sourceType,
          campaignName: campName,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign
        }
      });
    }
    campaignId = camp.id;
  }

  // 4. Resolve lead source
  let sourceId = null;
  const source = await prisma.leadSource.findFirst({
    where: {
      sourceType
    }
  });
  if (source) {
    sourceId = source.id;
  }

  // 5. Automatic Owner Assignment (Round-robin among active salespersons)
  let ownerUserId = input.ownerUserId;
  if (!ownerUserId) {
    const salespersons = await prisma.user.findMany({
      where: {
        role: 'salesperson',
        isActive: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    if (salespersons.length > 0) {
      // Pick salesperson with least recently assigned lead
      const leadCounts = await Promise.all(salespersons.map(async sp => {
        const count = await prisma.lead.count({
          where: {
            ownerUserId: sp.id
          }
        });
        return {
          user: sp,
          count
        };
      }));
      leadCounts.sort((a, b) => a.count - b.count);
      ownerUserId = leadCounts[0].user.id;
    } else {
      // Fallback to first active admin/manager
      const fallbackUser = await prisma.user.findFirst({
        where: {
          isActive: true
        }
      });
      ownerUserId = fallbackUser?.id || null;
    }
  }

  // 6. Create the Lead
  const newLead = await prisma.lead.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName || '',
      emailNormalized: emailNorm,
      phoneE164,
      company: input.company || null,
      requirement: input.requirement || null,
      status: input.status || 'new',
      priority: input.priority || 'medium',
      ownerUserId,
      sourceId,
      sourceType,
      sourceExternalId: input.sourceExternalId || null,
      campaignId,
      consentStatus: input.consentStatus || 'consented',
      consentSource: input.consentSource || sourceType,
      consentAt: new Date(),
      nextFollowupAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Day 1 default
    },
    include: {
      owner: true,
      source: true,
      campaign: true
    }
  });

  // 7. Record Intake Activity
  await prisma.leadActivity.create({
    data: {
      leadId: newLead.id,
      actorUserId: input.actorUserId || ownerUserId,
      activityType: 'system',
      direction: 'inbound',
      subject: `Lead Captured via ${sourceType.toUpperCase()}`,
      body: `New lead created from ${sourceType}. Requirement: "${input.requirement || 'N/A'}". Assigned to ${newLead.owner?.name || 'Unassigned'}.`,
      occurredAt: newLead.createdAt,
      metadata: JSON.stringify(input)
    }
  });

  // 8. Generate Automated Follow-up Tasks (Day 0, 1, 2, 5, 12, 21, 29)
  if (ownerUserId) {
    for (const seq of DEFAULT_FOLLOWUP_SEQUENCE) {
      const dueAt = new Date(Date.now() + seq.offsetDays * 24 * 60 * 60 * 1000);
      const idempotencyKey = `seq_${newLead.id}_day_${seq.offsetDays}`;
      await prisma.followupTask.create({
        data: {
          leadId: newLead.id,
          assignedUserId: ownerUserId,
          taskType: seq.channel === 'call' ? 'call' : seq.channel === 'whatsapp' ? 'whatsapp' : seq.channel === 'email' ? 'email' : 'followup',
          dueAt,
          status: 'pending',
          outcome: seq.label,
          attemptNumber: 1,
          idempotencyKey
        }
      });
    }

    // 9. Day 0 Acknowledgment if consented
    if (newLead.consentStatus === 'consented') {
      const emailTemplate = await prisma.messageTemplate.findFirst({
        where: {
          channel: 'email',
          isActive: true
        }
      });
      if (emailTemplate) {
        await prisma.outboundMessage.create({
          data: {
            leadId: newLead.id,
            channel: 'email',
            templateId: emailTemplate.id,
            status: 'sent',
            recipient: newLead.emailNormalized,
            payload: JSON.stringify({
              subject: emailTemplate.subject?.replace('{{requirement}}', newLead.requirement || 'legal inquiry'),
              body: emailTemplate.body.replace('{{firstName}}', newLead.firstName).replace('{{requirement}}', newLead.requirement || 'consultation').replace('{{ownerName}}', newLead.owner?.name || 'Advisory Team')
            }),
            sentAt: new Date(),
            idempotencyKey: `ack_msg_${newLead.id}_day0`
          }
        });
      }
    }
  }
  await recordAuditLog({
    actorUserId: input.actorUserId || ownerUserId,
    action: 'LEAD_CREATED',
    entityType: 'leads',
    entityId: newLead.id,
    after: newLead
  });
  return {
    lead: newLead,
    isDuplicate: false
  };
}