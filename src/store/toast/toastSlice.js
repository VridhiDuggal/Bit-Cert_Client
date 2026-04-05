import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'toast',
  initialState: { toasts: [] },
  reducers: {
    addToast(state, action) {
      const { type, message, duration } = action.payload;
      state.toasts.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        type,
        message,
        duration: duration ?? (type === 'error' ? 6000 : 4000),
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
