import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from './recipientNotificationsThunks';

const initialState = {
  notifications: [],
  total: 0,
  page: 1,
  filter: 'all',
  loading: false,
  error: null,
  unreadCount: 0,
  unreadCountLoading: false,
  markingRead: false,
};

const recipientNotificationsFeatureSlice = createSlice({
  name: 'recipientNotificationsFeature',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadCount.pending, (state) => {
        state.unreadCountLoading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCountLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.unreadCountLoading = false;
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.markingRead = true;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.markingRead = false;
        const notif = state.notifications.find(n => n.notification_id === action.payload);
        if (notif && !notif.is_read) {
          notif.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationRead.rejected, (state) => {
        state.markingRead = false;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.is_read = true; });
        state.unreadCount = 0;
      });
  },
});

export const { setPage, setFilter } = recipientNotificationsFeatureSlice.actions;
export default recipientNotificationsFeatureSlice.reducer;
