import { createSlice } from '@reduxjs/toolkit';
import {
  submitChangePassword,
  fetchOrgProfile,
  submitUpdateProfile,
  fetchNotifications,
  submitMarkNotificationRead,
  submitMarkAllNotificationsRead,
  fetchUnreadCount,
} from './orgSettingsThunks';

const initialState = {
  // Password
  saving:           false,
  error:            null,
  // Profile
  profile:          null,
  profileLoading:   false,
  profileSaving:    false,
  profileError:     null,
  // Notifications
  notifications:    [],
  notifTotal:       0,
  notifPage:        1,
  notifLoading:     false,
  unreadCount:      0,
};

const orgSettingsSlice = createSlice({
  name: 'orgSettings',
  initialState,
  reducers: {
    clearSettingsError(state) { state.error = null; },
    clearProfileError(state)  { state.profileError = null; },
    setNotifPage(state, action) { state.notifPage = action.payload; },
  },
  extraReducers: (builder) => {
    // ── Change password ────────────────────────────────────────────────────────
    builder
      .addCase(submitChangePassword.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(submitChangePassword.fulfilled, (state) => { state.saving = false; })
      .addCase(submitChangePassword.rejected, (state, action) => { state.saving = false; state.error = action.payload; });

    // ── Profile ────────────────────────────────────────────────────────────────
    builder
      .addCase(fetchOrgProfile.pending, (state) => { state.profileLoading = true; state.profileError = null; })
      .addCase(fetchOrgProfile.fulfilled, (state, action) => { state.profileLoading = false; state.profile = action.payload; })
      .addCase(fetchOrgProfile.rejected, (state, action) => { state.profileLoading = false; state.profileError = action.payload; })
      .addCase(submitUpdateProfile.pending, (state) => { state.profileSaving = true; state.profileError = null; })
      .addCase(submitUpdateProfile.fulfilled, (state, action) => { state.profileSaving = false; state.profile = action.payload; })
      .addCase(submitUpdateProfile.rejected, (state, action) => { state.profileSaving = false; state.profileError = action.payload; });

    // ── Notifications ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchNotifications.pending, (state) => { state.notifLoading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifLoading  = false;
        state.notifications = action.payload.notifications;
        state.notifTotal    = action.payload.total;
      })
      .addCase(fetchNotifications.rejected, (state) => { state.notifLoading = false; })
      .addCase(submitMarkNotificationRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.notification_id === action.payload.notification_id);
        if (notif) { notif.read_at = action.payload.read_at; }
        if (state.unreadCount > 0) state.unreadCount -= 1;
      })
      .addCase(submitMarkAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { if (!n.read_at) n.read_at = new Date().toISOString(); });
        state.unreadCount = 0;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => { state.unreadCount = action.payload; });
  },
});

export const { clearSettingsError, clearProfileError, setNotifPage } = orgSettingsSlice.actions;
export default orgSettingsSlice.reducer;

