import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Starting CRM database seed...');

  // 1. Users
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@legalwegal.com'
    },
    update: {},
    create: {
      name: 'Aditya Sharma (Admin)',
      email: 'admin@legalwegal.com',
      passwordHash,
      role: 'admin',
      isActive: true
    }
  });
  const manager = await prisma.user.upsert({
    where: {
      email: 'manager@legalwegal.com'
    },
    update: {},
    create: {
      name: 'Sneha Patel (Sales Manager)',
      email: 'manager@legalwegal.com',
      passwordHash,
      role: 'manager',
      isActive: true
    }
  });
  const sales1 = await prisma.user.upsert({
    where: {
      email: 'rahul@legalwegal.com'
    },
    update: {},
    create: {
      name: 'Rahul Verma (Sales Exec)',
      email: 'rahul@legalwegal.com',
      passwordHash,
      role: 'salesperson',
      isActive: true
    }
  });
  const sales2 = await prisma.user.upsert({
    where: {
      email: 'priya@legalwegal.com'
    },
    update: {},
    create: {
      name: 'Priya Iyer (Sales Exec)',
      email: 'priya@legalwegal.com',
      passwordHash,
      role: 'salesperson',
      isActive: true
    }
  });
  console.log('✅ Users seeded');

  // 2. Lead Sources
  const sourceMeta = await prisma.leadSource.create({
    data: {
      name: 'Meta Lead Ads (FB & IG)',
      sourceType: 'meta',
      externalAccountId: 'act_9823746190',
      formId: 'form_meta_corporate_2026',
      isActive: true
    }
  });
  const sourceWeb = await prisma.leadSource.create({
    data: {
      name: 'Website Contact & Consultation Form',
      sourceType: 'website',
      landingPage: 'https://legalwegal.com/consultation',
      isActive: true
    }
  });
  const sourceGoogle = await prisma.leadSource.create({
    data: {
      name: 'Google Ads Search (Trademark & IP)',
      sourceType: 'google_ads',
      externalAccountId: 'gad_8471928374',
      isActive: true
    }
  });
  const sourceManual = await prisma.leadSource.create({
    data: {
      name: 'Direct Phone / Inbound Walk-in',
      sourceType: 'manual',
      isActive: true
    }
  });
  console.log('✅ Sources seeded');

  // 3. Campaigns
  const campMeta = await prisma.campaign.create({
    data: {
      platform: 'meta',
      externalCampaignId: 'cmp_meta_881923',
      campaignName: 'Meta_Trademark_Registration_Q4',
      adSetId: 'adset_founders_startup',
      adSetName: 'Startup Founders 25-45 India',
      adId: 'ad_fastrack_trademark',
      adName: 'Fastrack Trademark Video Ad',
      utmSource: 'facebook',
      utmMedium: 'paid_social',
      utmCampaign: 'trademark_q4'
    }
  });
  const campGoogle = await prisma.campaign.create({
    data: {
      platform: 'google_ads',
      externalCampaignId: 'cmp_gad_339182',
      campaignName: 'Google_Company_Incorporation_2026',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'incorporation_search'
    }
  });
  console.log('✅ Campaigns seeded');

  // 4. Message Templates
  const tplWhatsAppDay0 = await prisma.messageTemplate.create({
    data: {
      channel: 'whatsapp',
      name: 'Day 0 - Welcome & Legal Consultation Pack',
      providerTemplateName: 'lw_welcome_consultation_v1',
      language: 'en',
      approvalStatus: 'approved',
      body: 'Hello {{1}}, thank you for reaching out to Legal Wegal regarding {{2}}. Our senior legal advocate has been assigned to your request and will connect with you shortly. You can preview our advisory services guide here: https://legalwegal.com/guide/services',
      isActive: true
    }
  });
  const tplEmailDay0 = await prisma.messageTemplate.create({
    data: {
      channel: 'email',
      name: 'Day 0 - Official Consultation Acknowledgment',
      subject: 'Thank you for contacting Legal Wegal — Your Request Summary',
      language: 'en',
      approvalStatus: 'approved',
      body: `Hi {{firstName}},\n\nThank you for choosing Legal Wegal for your legal and corporate compliance requirements. We have received your inquiry regarding "{{requirement}}".\n\nYour assigned legal counsel is {{ownerName}}, who will review your initial documents and reach out today.\n\nWarm regards,\nLegal Wegal Client Advisory Team`,
      isActive: true
    }
  });
  const tplWhatsAppDay2 = await prisma.messageTemplate.create({
    data: {
      channel: 'whatsapp',
      name: 'Day 2 - Quick Followup Touchpoint',
      providerTemplateName: 'lw_followup_day2',
      language: 'en',
      approvalStatus: 'approved',
      body: 'Hi {{1}}, following up from Legal Wegal regarding your {{2}} inquiry. Would today at 3:00 PM or 5:00 PM work for a quick 10-minute briefing call with our attorney?',
      isActive: true
    }
  });
  console.log('✅ Message Templates seeded');

  // 5. Automation Rules (Day 0, 1, 2, 5, 12, 21, 29)
  const rules = [{
    name: 'Day 0: Instant Acknowledgment & Owner Alert',
    triggerType: 'lead_created',
    offsetDays: 0,
    channel: 'email',
    templateId: tplEmailDay0.id,
    enabled: true,
    businessHoursOnly: false,
    stopOnReply: false
  }, {
    name: 'Day 1: First Phone Follow-up Task',
    triggerType: 'lead_created',
    offsetDays: 1,
    channel: 'task',
    enabled: true,
    businessHoursOnly: true,
    stopOnReply: true
  }, {
    name: 'Day 2: WhatsApp Touchpoint',
    triggerType: 'lead_created',
    offsetDays: 2,
    channel: 'whatsapp',
    templateId: tplWhatsAppDay2.id,
    enabled: true,
    businessHoursOnly: true,
    stopOnReply: true
  }, {
    name: 'Day 5: Nurture & Check-in Call',
    triggerType: 'lead_created',
    offsetDays: 5,
    channel: 'task',
    enabled: true,
    businessHoursOnly: true,
    stopOnReply: true
  }, {
    name: 'Day 12: Advisory Follow-up',
    triggerType: 'lead_created',
    offsetDays: 12,
    channel: 'email',
    enabled: true,
    businessHoursOnly: true,
    stopOnReply: true
  }, {
    name: 'Day 21: Priority Consultation Check-in',
    triggerType: 'lead_created',
    offsetDays: 21,
    channel: 'whatsapp',
    enabled: true,
    businessHoursOnly: true,
    stopOnReply: true
  }, {
    name: 'Day 29: Move to Long-term Nurture or Close',
    triggerType: 'lead_created',
    offsetDays: 29,
    channel: 'task',
    enabled: true,
    businessHoursOnly: true,
    stopOnReply: false
  }];
  for (const r of rules) {
    await prisma.automationRule.create({
      data: r
    });
  }
  console.log('✅ Automation Rules seeded');

  // 6. Integration Accounts
  await prisma.integrationAccount.createMany({
    data: [{
      provider: 'meta',
      accountLabel: 'Legal Wegal Meta Business Suite (Connected)',
      externalAccountId: 'act_9823746190',
      status: 'connected',
      lastSuccessAt: new Date()
    }, {
      provider: 'whatsapp',
      accountLabel: 'WhatsApp Cloud API Official (+91 98765 43210)',
      externalAccountId: '109876543210',
      status: 'connected',
      lastSuccessAt: new Date()
    }, {
      provider: 'email',
      accountLabel: 'Resend Transactional Outreach',
      externalAccountId: 'resend_prod_legalwegal',
      status: 'connected',
      lastSuccessAt: new Date()
    }, {
      provider: 'google_ads',
      accountLabel: 'Google Ads Search & Lead Form Extensions',
      externalAccountId: '847-192-8374',
      status: 'connected',
      lastSuccessAt: new Date()
    }]
  });
  console.log('✅ Integration Accounts seeded');

  // 7. Seed Sample Leads with realistic data
  const sampleLeads = [{
    firstName: 'Vikram',
    lastName: 'Singhania',
    emailNormalized: 'vikram@singhaniatech.in',
    phoneE164: '+919820112233',
    company: 'Singhania Tech Enterprises',
    requirement: 'Private Limited Company Incorporation & Founder Agreement',
    status: 'new',
    priority: 'high',
    ownerUserId: sales1.id,
    sourceId: sourceMeta.id,
    sourceType: 'meta',
    sourceExternalId: 'meta_lead_448102',
    campaignId: campMeta.id,
    consentStatus: 'consented',
    consentSource: 'meta_instant_form',
    consentAt: new Date()
  }, {
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    emailNormalized: 'ananya@zenithretail.com',
    phoneE164: '+919833445566',
    company: 'Zenith Retail Solutions',
    requirement: 'Multi-class Trademark Registration (Class 35 & 42)',
    status: 'contacted',
    priority: 'urgent',
    ownerUserId: sales2.id,
    sourceId: sourceWeb.id,
    sourceType: 'website',
    sourceExternalId: 'web_form_9931',
    consentStatus: 'consented',
    consentSource: 'website_checkbox',
    consentAt: new Date()
  }, {
    firstName: 'Karan',
    lastName: 'Mehta',
    emailNormalized: 'karan.mehta@solargreentech.org',
    phoneE164: '+919920556677',
    company: 'Solar Green Tech LLP',
    requirement: 'Commercial Lease Agreement Drafting & Vendor Contracts',
    status: 'qualified',
    priority: 'medium',
    ownerUserId: sales1.id,
    sourceId: sourceGoogle.id,
    sourceType: 'google_ads',
    campaignId: campGoogle.id,
    consentStatus: 'consented',
    consentSource: 'google_lead_ad',
    consentAt: new Date()
  }, {
    firstName: 'Meera',
    lastName: 'Nambiar',
    emailNormalized: 'meera@nambiarartisans.co',
    phoneE164: '+919811223344',
    company: 'Nambiar Artisans Private Limited',
    requirement: 'Patent Filing Consultation & IP Protection',
    status: 'proposal',
    priority: 'high',
    ownerUserId: sales2.id,
    sourceId: sourceManual.id,
    sourceType: 'manual',
    consentStatus: 'consented',
    consentSource: 'inbound_call',
    consentAt: new Date()
  }, {
    firstName: 'Arjun',
    lastName: 'Bose',
    emailNormalized: 'arjun.bose@finmatrix.io',
    phoneE164: '+919711889900',
    company: 'FinMatrix Fintech Labs',
    requirement: 'RBI NBFC Regulatory Compliance & Data Privacy Audit',
    status: 'won',
    priority: 'urgent',
    ownerUserId: sales1.id,
    sourceId: sourceMeta.id,
    sourceType: 'meta',
    campaignId: campMeta.id,
    consentStatus: 'consented',
    wonAt: new Date()
  }, {
    firstName: 'Rohit',
    lastName: 'Kapoor',
    emailNormalized: 'rohit@kapoortransport.com',
    phoneE164: '+919822334455',
    company: 'Kapoor Transport Logistics',
    requirement: 'GST Dispute Resolution',
    status: 'lost',
    priority: 'low',
    ownerUserId: sales2.id,
    sourceId: sourceWeb.id,
    sourceType: 'website',
    consentStatus: 'consented',
    lostReason: 'Budget constraints; opted for local practitioner'
  }];
  for (const leadData of sampleLeads) {
    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        nextFollowupAt: new Date(Date.now() + 86400000 * 2)
      }
    });

    // Create intake activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        actorUserId: lead.ownerUserId,
        activityType: 'system',
        direction: 'inbound',
        subject: 'Lead Captured via ' + lead.sourceType.toUpperCase(),
        body: `Lead automatically ingested from ${lead.sourceType} with requirement: "${lead.requirement}". Consent validated and follow-up sequence initiated.`,
        occurredAt: lead.createdAt
      }
    });

    // Create sample call or note
    if (lead.status === 'contacted' || lead.status === 'qualified' || lead.status === 'proposal' || lead.status === 'won') {
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          actorUserId: lead.ownerUserId,
          activityType: 'call',
          direction: 'outbound',
          subject: 'Initial Discovery Call',
          body: 'Discussed scope of work, timeline, and required regulatory filings. Client requested formal engagement proposal.',
          occurredAt: new Date(Date.now() - 3600000 * 12)
        }
      });
    }

    // Create followup task
    await prisma.followupTask.create({
      data: {
        leadId: lead.id,
        assignedUserId: lead.ownerUserId || admin.id,
        taskType: 'call',
        dueAt: new Date(Date.now() + 86400000),
        status: lead.status === 'won' ? 'completed' : 'pending',
        attemptNumber: 1,
        idempotencyKey: `init_task_${lead.id}_day1`
      }
    });
  }
  console.log('✅ Sample leads and activities seeded');
  console.log('🎉 Seed completed successfully!');
}
main().catch(e => {
  console.error('Error seeding database:', e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});