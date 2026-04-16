import { request } from './client';

export function onboardOrg(data) {
  return request('/api/org/onboard', { method: 'POST', body: data });
}

export function loginOrg(data) {
  return request('/api/org/login', { method: 'POST', body: data });
}

export function getOrgProfile(token) {
  return request('/api/org/profile', { token });
}

export function getRecipients(token, page = 1, limit = 10) {
  return request(`/api/org/recipients?page=${page}&limit=${limit}`, { token });
}

export function getCertificates(token, page = 1, limit = 10) {
  return request(`/api/org/certificates?page=${page}&limit=${limit}`, { token });
}

export function getAuditLogs(token, { page = 1, limit = 15, action = '', target = '', date_from = '', date_to = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (action)    params.set('action', action);
  if (target)    params.set('target', target);
  if (date_from) params.set('date_from', date_from);
  if (date_to)   params.set('date_to', date_to);
  return request(`/api/org/audit-logs?${params}`, { token });
}

export async function exportAuditLogs(token, filters = {}) {
  const { action = '', target = '', date_from = '', date_to = '' } = filters;
  const params = new URLSearchParams();
  if (action)    params.set('action', action);
  if (target)    params.set('target', target);
  if (date_from) params.set('date_from', date_from);
  if (date_to)   params.set('date_to', date_to);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
  const res = await fetch(`${API_BASE_URL}/api/org/audit-logs/export?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Export failed.');
  return res.blob();
}

export function revokeCertificate(token, cert_hash, password) {
  return request(`/api/org/certificate/revoke/${cert_hash}`, { method: 'POST', body: { password }, token });
}

export function changePassword(token, data) {
  return request('/api/org/change-password', { method: 'POST', body: data, token });
}

export function updateOrgProfile(token, data) {
  return request('/api/org/profile', { method: 'PATCH', body: data, token });
}

export function getNotifications(token, page = 1, limit = 10) {
  return request(`/api/org/notifications?page=${page}&limit=${limit}`, { token });
}

export function markNotificationRead(token, id) {
  return request(`/api/org/notifications/${id}/read`, { method: 'PATCH', token });
}

export function markAllNotificationsRead(token) {
  return request('/api/org/notifications/read-all', { method: 'PATCH', token });
}

export function getUnreadCount(token) {
  return request('/api/org/notifications/unread-count', { token });
}

export async function downloadOrgCertificate(token, id) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
  const res = await fetch(`${API_BASE_URL}/api/org/certificate/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Download failed.');
  return res.blob();
}

