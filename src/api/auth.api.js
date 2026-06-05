import { request } from './client';

export function forgotPassword(email) {
  return request('/api/auth/forgot-password', { method: 'POST', body: { email } });
}

export function verifyOtp(email, otp) {
  return request('/api/auth/verify-otp', { method: 'POST', body: { email, otp } });
}

export function resetPassword(token, password) {
  return request('/api/auth/reset-password', { method: 'POST', body: { token, password } });
}
