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

export function getAuditLogs(token, page = 1, limit = 10) {
  return request(`/api/org/audit-logs?page=${page}&limit=${limit}`, { token });
}

