export const USER_ROLES = ['admin', 'manager', 'salesperson'];
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'nurture'];
export const LEAD_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
export const SOURCE_TYPES = ['meta', 'website', 'google_ads', 'manual', 'api'];
export const CONSENT_STATUSES = ['pending', 'consented', 'declined', 'revoked'];
export const ACTIVITY_TYPES = ['call', 'email', 'whatsapp', 'meeting', 'note', 'status_change', 'assignment', 'system'];
export const TASK_TYPES = ['call', 'followup', 'email', 'whatsapp', 'review'];
export const TASK_STATUSES = ['pending', 'completed', 'snoozed', 'cancelled'];
export const MESSAGE_CHANNELS = ['whatsapp', 'email', 'task'];
export const MESSAGE_STATUSES = ['pending', 'sent', 'delivered', 'read', 'failed'];
export const DEFAULT_FOLLOWUP_SEQUENCE = [{
  offsetDays: 0,
  action: 'lead_intake_alert',
  channel: 'email',
  label: 'Day 0: Intake & Acknowledgment'
}, {
  offsetDays: 1,
  action: 'call_followup_1',
  channel: 'call',
  label: 'Day 1: First Phone Follow-up'
}, {
  offsetDays: 2,
  action: 'followup_2',
  channel: 'whatsapp',
  label: 'Day 2: Second Touchpoint'
}, {
  offsetDays: 5,
  action: 'followup_5',
  channel: 'call',
  label: 'Day 5: Nurture & Check-in'
}, {
  offsetDays: 12,
  action: 'followup_12',
  channel: 'email',
  label: 'Day 12: Long-term Check-in'
}, {
  offsetDays: 21,
  action: 'followup_21',
  channel: 'whatsapp',
  label: 'Day 21: Final-stage Check-in'
}, {
  offsetDays: 29,
  action: 'followup_29',
  channel: 'task',
  label: 'Day 29: Move to Nurture or Close'
}];