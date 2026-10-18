import { prisma } from '@crm/database';
export async function processFollowupTask(taskId) {
  const task = await prisma.followupTask.findUnique({
    where: {
      id: taskId
    },
    include: {
      lead: {
        include: {
          owner: true
        }
      },
      automationRule: {
        include: {
          template: true
        }
      }
    }
  });
  if (!task || !task.lead) {
    console.log(`[WORKER] Task ${taskId} or lead not found, skipping.`);
    return {
      status: 'skipped',
      reason: 'not_found'
    };
  }
  const {
    lead,
    automationRule
  } = task;

  // Step 10: Check stop conditions
  if (lead.status === 'won' || lead.status === 'lost') {
    console.log(`[WORKER] Lead ${lead.id} is already ${lead.status}. Cancelling task ${taskId}.`);
    await prisma.followupTask.update({
      where: {
        id: taskId
      },
      data: {
        status: 'cancelled',
        outcome: `Auto-cancelled: Lead marked ${lead.status}`
      }
    });
    return {
      status: 'cancelled',
      reason: `lead_${lead.status}`
    };
  }
  if (lead.doNotContactAt || lead.consentStatus === 'revoked' || lead.consentStatus === 'declined') {
    console.log(`[WORKER] Lead ${lead.id} opted out or declined consent. Cancelling task.`);
    await prisma.followupTask.update({
      where: {
        id: taskId
      },
      data: {
        status: 'cancelled',
        outcome: 'Auto-cancelled: Contact opted out'
      }
    });
    return {
      status: 'cancelled',
      reason: 'opt_out'
    };
  }
  if (task.status === 'snoozed') {
    console.log(`[WORKER] Task ${taskId} is currently snoozed due to customer inbound reply.`);
    return {
      status: 'snoozed'
    };
  }

  // Step 11: Task-only rule vs Messaging rule
  if (task.taskType === 'call' || task.taskType === 'followup' || !automationRule?.template) {
    // Task-only: notify/keep pending for salesperson action
    console.log(`[WORKER] Follow-up task ${taskId} (${task.taskType}) ready for owner ${lead.owner?.name}.`);
    return {
      status: 'pending_agent_action'
    };
  }

  // Messaging rule: Dispatch message
  const template = automationRule.template;
  const channel = automationRule.channel;
  const recipient = channel === 'whatsapp' ? lead.phoneE164 : lead.emailNormalized;
  console.log(`[WORKER] Dispatching automated ${channel} message for lead ${lead.id} to ${recipient}`);
  const idempotencyKey = `auto_send_${task.id}_${template.id}`;
  const message = await prisma.outboundMessage.upsert({
    where: {
      idempotencyKey
    },
    update: {
      status: 'sent',
      sentAt: new Date()
    },
    create: {
      leadId: lead.id,
      taskId: task.id,
      channel,
      templateId: template.id,
      status: 'sent',
      recipient,
      providerMessageId: `msg_${Date.now()}_prov`,
      payload: JSON.stringify({
        body: template.body.replace('{{1}}', lead.firstName).replace('{{2}}', lead.requirement || 'legal inquiry').replace('{{firstName}}', lead.firstName)
      }),
      sentAt: new Date(),
      idempotencyKey
    }
  });

  // Record timeline activity
  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      actorUserId: lead.ownerUserId,
      activityType: channel === 'whatsapp' ? 'whatsapp' : 'email',
      direction: 'outbound',
      subject: `Automated ${channel.toUpperCase()} Sent: ${template.name}`,
      body: `Message dispatched via approved template "${template.name}". Recipient: ${recipient}`,
      occurredAt: new Date()
    }
  });

  // Mark task completed
  await prisma.followupTask.update({
    where: {
      id: taskId
    },
    data: {
      status: 'completed',
      completedAt: new Date(),
      outcome: `Automated message dispatched via ${channel}`
    }
  });
  return {
    status: 'dispatched',
    messageId: message.id
  };
}