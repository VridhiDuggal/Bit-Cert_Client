import { createSlice } from '@reduxjs/toolkit';

const SESSION_KEY = 'bit_cert_recipient_session';

function loadRecipientSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { token: null, recipient: null, isAuthenticated: false };
    const { token, recipient, expiresAt } = JSON.parse(raw);
    if (!token || !recipient || !expiresAt) return { token: null, recipient: null, isAuthenticated: false };
    if (Date.now() > expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return { token: null, recipient: null, isAuthenticated: false };
    }
    return { token, recipient, isAuthenticated: true };
  } catch {
    return { token: null, recipient: null, isAuthenticated: false };
  }
}

function saveRecipientSession(token, recipient) {
  try {
    let expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp) expiresAt = payload.exp * 1000;
      }
    } catch {}
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, recipient, expiresAt }));
  } catch {}
}

function clearRecipientSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

const initialState = loadRecipientSession();

const recipientAuthSlice = createSlice({
  name: 'recipientAuth',
  initialState,
  reducers: {
    recipientLoginSuccess(state, action) {
      state.token = action.payload.token;
      state.recipient = action.payload.recipient;
      state.isAuthenticated = true;
      saveRecipientSession(action.payload.token, action.payload.recipient);
    },
    recipientLogout(state) {
      state.token = null;
      state.recipient = null;
      state.isAuthenticated = false;
      clearRecipientSession();
    },
  },
});

export const { recipientLoginSuccess, recipientLogout } = recipientAuthSlice.actions;
export default recipientAuthSlice.reducer;
