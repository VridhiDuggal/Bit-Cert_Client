import { request } from './client';

export function loginRecipient(data) {
  return request('/api/recipient/login', { method: 'POST', body: data });
}

export function getRecipientProfile(token) {
  return request('/api/recipient/profile', { token });
}

export function getRecipientDashboardStats(token) {
  return request('/api/recipient/dashboard/stats', { token });
}

export function getRecipientCertificates(token, { page = 1, limit = 10, search = '', status = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  return request(`/api/recipient/certificates?${params}`, { token });
}

export function getRecipientCertificate(token, id) {
  return request(`/api/recipient/certificate/${id}`, { token });
}

export function getRecipientCertificateQR(token, id) {
  return request(`/api/recipient/certificate/${id}/qr`, { token });
}

export function getVerificationHistory(token, id) {
  return request(`/api/recipient/certificate/${id}/verification-history`, { token });
}

export function getNotifications(token, { page = 1, limit = 20, filter = 'all' } = {}) {
  const params = new URLSearchParams({ page, limit, filter });
  return request(`/api/recipient/notifications?${params}`, { token });
}

export function getUnreadCount(token) {
  return request('/api/recipient/notifications/unread-count', { token });
}

export function markNotificationRead(token, id) {
  return request(`/api/recipient/notifications/${id}/read`, { method: 'PATCH', token });
}

export function markAllNotificationsRead(token) {
  return request('/api/recipient/notifications/read-all', { method: 'PATCH', token });
}

export function updateRecipientProfile(token, data) {
  return request('/api/recipient/profile', { method: 'PATCH', body: data, token });
}

export function changeRecipientPassword(token, data) {
  return request('/api/recipient/change-password', { method: 'POST', body: data, token });
}

export function previewInvite(token_string) {
  return request(`/api/recipient/invite-preview?token=${encodeURIComponent(token_string)}`);
}

export function acceptInvite(data) {
  return request('/api/recipient/accept-invite', { method: 'POST', body: data });
}
