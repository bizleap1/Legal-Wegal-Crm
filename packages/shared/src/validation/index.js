import { z } from 'zod';
import { LEAD_STATUSES, LEAD_PRIORITIES, SOURCE_TYPES, CONSENT_STATUSES, ACTIVITY_TYPES, TASK_TYPES, TASK_STATUSES, MESSAGE_CHANNELS } from '../constants/index.js';
export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
export function normalizePhoneE164(phone, defaultCountryCode = '+91') {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = defaultCountryCode + cleaned;
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = '+' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export const CreateLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().default(''),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  company: z.string().optional().nullable(),
  requirement: z.string().optional().nullable(),
  status: z.enum(LEAD_STATUSES).default('new'),
  priority: z.enum(LEAD_PRIORITIES).default('medium'),
  ownerUserId: z.string().uuid().optional().nullable(),
  sourceType: z.enum(SOURCE_TYPES).default('manual'),
  sourceExternalId: z.string().optional().nullable(),
  campaignName: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  gclid: z.string().optional().nullable(),
  consentStatus: z.enum(CONSENT_STATUSES).default('consented'),
  consentSource: z.string().default('manual_entry')
});
export const UpdateLeadSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional().nullable(),
  requirement: z.string().optional().nullable(),
  status: z.enum(LEAD_STATUSES).optional(),
  priority: z.enum(LEAD_PRIORITIES).optional(),
  ownerUserId: z.string().uuid().optional().nullable(),
  consentStatus: z.enum(CONSENT_STATUSES).optional(),
  doNotContactAt: z.string().optional().nullable(),
  lostReason: z.string().optional().nullable(),
  nextFollowupAt: z.string().optional().nullable()
});
export const CreateActivitySchema = z.object({
  activityType: z.enum(ACTIVITY_TYPES),
  direction: z.enum(['inbound', 'outbound']).default('outbound'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body / notes are required'),
  occurredAt: z.string().optional(),
  metadata: z.record(z.any()).optional()
});
export const CreateTaskSchema = z.object({
  leadId: z.string().uuid(),
  assignedUserId: z.string().uuid().optional(),
  taskType: z.enum(TASK_TYPES).default('call'),
  dueAt: z.string(),
  outcome: z.string().optional()
});
export const UpdateTaskSchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  dueAt: z.string().optional(),
  outcome: z.string().optional()
});
export const PublicFormSubmitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Valid phone number is required'),
  company: z.string().optional(),
  requirement: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  gclid: z.string().optional(),
  wbraid: z.string().optional(),
  gbraid: z.string().optional(),
  landing_page: z.string().optional(),
  referrer: z.string().optional(),
  consent: z.boolean().default(true),
  honeypot: z.string().max(0, 'Spam detected').optional().or(z.literal(''))
});
export const CreateAutomationRuleSchema = z.object({
  name: z.string().min(2),
  triggerType: z.string().default('lead_created'),
  offsetDays: z.number().int().min(0),
  channel: z.enum(MESSAGE_CHANNELS),
  templateId: z.string().uuid().optional().nullable(),
  enabled: z.boolean().default(true),
  businessHoursOnly: z.boolean().default(true),
  stopOnReply: z.boolean().default(true),
  conditions: z.record(z.any()).optional()
});