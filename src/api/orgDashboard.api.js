import { request } from './client';

export function fetchStats(token) {
  return request('/api/org/dashboard/stats', { token });
}

export function fetchCertificates(token, page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set('search', search);
  return request(`/api/org/certificates?${params}`, { token });
}
