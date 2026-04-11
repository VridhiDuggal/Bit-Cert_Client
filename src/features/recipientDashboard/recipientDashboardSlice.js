import { createSlice } from '@reduxjs/toolkit';
import { fetchRecipientStats, fetchRecentCertificates, fetchRecentNotifications } from './recipientDashboardThunks';

const initialState = {
  stats: {
    total_certificates: 0,
    active_certificates: 0,
    orgs_count: 0,
    total_verifications: 0,
  },
  statsLoading: false,
  statsError: null,
  recentCertificates: [],
  recentCertsLoading: false,
  recentCertsError: null,
  recentNotifications: [],
  recentNotifsLoading: false,
  recentNotifsError: null,
};

const recipientDashboardSlice = createSlice({
  name: 'recipientDashboard',
  initialState,
  reducers: {
    markRecentNotificationRead(state, action) {
      const notif = state.recentNotifications.find(n => n.notification_id === action.payload);
      if (notif) notif.is_read = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipientStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchRecipientStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchRecipientStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })
      .addCase(fetchRecentCertificates.pending, (state) => {
        state.recentCertsLoading = true;
        state.recentCertsError = null;
      })
      .addCase(fetchRecentCertificates.fulfilled, (state, action) => {
        state.recentCertsLoading = false;
        state.recentCertificates = action.payload;
      })
      .addCase(fetchRecentCertificates.rejected, (state, action) => {
        state.recentCertsLoading = false;
        state.recentCertsError = action.payload;
      })
      .addCase(fetchRecentNotifications.pending, (state) => {
        state.recentNotifsLoading = true;
        state.recentNotifsError = null;
      })
      .addCase(fetchRecentNotifications.fulfilled, (state, action) => {
        state.recentNotifsLoading = false;
        state.recentNotifications = action.payload;
      })
      .addCase(fetchRecentNotifications.rejected, (state, action) => {
        state.recentNotifsLoading = false;
        state.recentNotifsError = action.payload;
      });
  },
});

export const { markRecentNotificationRead } = recipientDashboardSlice.actions;
export default recipientDashboardSlice.reducer;
