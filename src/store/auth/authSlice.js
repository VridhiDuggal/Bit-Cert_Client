import { createSlice } from '@reduxjs/toolkit';

const SESSION_KEY = 'bit_cert_session';

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { token: null, org: null, isAuthenticated: false };
    const { token, org, expiresAt } = JSON.parse(raw);
    if (!token || !org || !expiresAt) return { token: null, org: null, isAuthenticated: false };
    if (Date.now() > expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return { token: null, org: null, isAuthenticated: false };
    }
    return { token, org, isAuthenticated: true };
  } catch {
    return { token: null, org: null, isAuthenticated: false };
  }
}

function saveSession(token, org) {
  try {
    let expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp) expiresAt = payload.exp * 1000;
      }
    } catch {}
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, org, expiresAt }));
  } catch {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

const initialState = loadSession();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.org = action.payload.org;
      state.isAuthenticated = true;
      saveSession(action.payload.token, action.payload.org);
    },
    logout(state) {
      state.token = null;
      state.org = null;
      state.isAuthenticated = false;
      clearSession();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
