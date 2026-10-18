'use client';

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('lw_crm_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
export function setCurrentUser(user, token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lw_crm_user', JSON.stringify(user));
  localStorage.setItem('lw_crm_token', token);
}
export function clearUserSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lw_crm_user');
  localStorage.removeItem('lw_crm_token');
}