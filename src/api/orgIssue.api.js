import { request } from './client';

export function issueCertificate(token, data) {
  return request('/api/org/certificate/issue', { method: 'POST', body: data, token });
}

export function fetchCertificates(token, page = 1, limit = 10, filters = {}) {
  const params = new URLSearchParams({ page, limit });
  if (filters.search)        params.set('search', filters.search);
  if (filters.status)        params.set('status', filters.status);
  if (filters.expiry_status) params.set('expiry_status', filters.expiry_status);
  if (filters.date_from)     params.set('from_date', filters.date_from);
  if (filters.date_to)       params.set('to_date', filters.date_to);
  if (filters.tags && filters.tags.length) params.set('tags', filters.tags.join(','));
  return request(`/api/org/certificates?${params}`, { token });
}

export function fetchCertificateById(token, id) {
  return request(`/api/org/certificate/${id}`, { token });
}

export function getVerificationHistory(token, certId, page = 1) {
  return request(`/api/org/certificate/${certId}/verification-history?page=${page}&limit=20`, { token });
}

export function resendCertificate(token, certId) {
  return request(`/api/org/certificate/${certId}/resend`, { method: 'POST', token });
}

export function searchRecipients(token, query, limit = 8) {
  return request(`/api/org/recipients?search=${encodeURIComponent(query)}&limit=${limit}`, { token });
}
