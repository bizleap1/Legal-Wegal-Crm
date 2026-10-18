const API_BASE = '/api/v1';
export class ApiError extends Error {
  statusCode;
  details;
  constructor(message, statusCode, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}
async function fetchJson(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('lw_crm_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? {
      Authorization: `Bearer ${token}`
    } : {}),
    ...(options.headers || {})
  };
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include'
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || 'An error occurred', res.status, data.details);
  }
  return data;
}
export const api = {
  // Auth
  login: credentials => fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  logout: () => fetchJson('/auth/logout', {
    method: 'POST'
  }),
  getMe: () => fetchJson('/auth/me'),
  // Leads
  getLeads: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    return fetchJson(`/leads?${query.toString()}`);
  },
  createLead: payload => fetchJson('/leads', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getLead: id => fetchJson(`/leads/${id}`),
  updateLead: (id, payload) => fetchJson(`/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  assignLead: (id, ownerUserId) => fetchJson(`/leads/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({
      ownerUserId
    })
  }),
  recordFeedback: (id, payload) => fetchJson(`/leads/${id}/feedback`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  // Activities
  getLeadActivities: leadId => fetchJson(`/leads/${leadId}/activities`),
  addLeadActivity: (leadId, payload) => fetchJson(`/leads/${leadId}/activities`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    return fetchJson(`/tasks?${query.toString()}`);
  },
  createTask: payload => fetchJson('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateTask: (id, payload) => fetchJson(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  // Reports
  getOverviewReport: () => fetchJson('/reports/overview'),
  getSourcesReport: () => fetchJson('/reports/sources'),
  // Automation & Templates
  getRules: () => fetchJson('/automation/rules'),
  createRule: payload => fetchJson('/automation/rules', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateRule: (id, payload) => fetchJson(`/automation/rules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  getTemplates: () => fetchJson('/automation/templates'),
  createTemplate: payload => fetchJson('/automation/templates', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  // Integrations
  getIntegrations: () => fetchJson('/integrations'),
  connectMeta: payload => fetchJson('/integrations/meta/connect', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  testWhatsApp: payload => fetchJson('/integrations/whatsapp/test', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  testEmail: payload => fetchJson('/integrations/email/test', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  // Users
  getUsers: () => fetchJson('/users'),
  // Public Forms & Webhook Simulators
  submitPublicForm: (formKey, payload) => fetchJson(`/public/forms/${formKey}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  simulateMetaWebhook: payload => fetchJson('/webhooks/meta', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  simulateWhatsAppWebhook: payload => fetchJson('/webhooks/whatsapp', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  simulateGoogleAdsWebhook: payload => fetchJson('/webhooks/google-ads', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};