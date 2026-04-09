import { request } from './client';

export function issueCertificate(token, data) {
  return request('/api/org/certificate/issue', { method: 'POST', body: data, token });
}

export function fetchCertificates(token, page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set('search', search);
  return request(`/api/org/certificates?${params}`, { token });
}

export function fetchCertificateById(token, id) {
  return request(`/api/org/certificate/${id}`, { token });
}
