import { request } from './client';

export function getRecipients(token, params = {}) {
  const q = new URLSearchParams({ page: params.page ?? 1, limit: params.limit ?? 10 });
  if (params.search)              q.set('search', params.search);
  if (params.filters?.status)    q.set('status', params.filters.status);
  return request(`/api/org/recipients?${q}`, { token });
}

export function getRecipientDetail(token, id) {
  return request(`/api/org/recipient/${id}`, { token });
}

export function updateRecipient(token, id, data) {
  return request(`/api/org/recipient/${id}`, { method: 'PATCH', body: data, token });
}

export function sendInvite(token, email) {
  return request('/api/org/invite', { method: 'POST', body: { email }, token });
}

export function sendBulkInvite(token, invites) {
  return request('/api/org/invite', { method: 'POST', body: { invites }, token });
}
