import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUnreadCount, getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/recipient.api';

export const fetchUnreadCount = createAsyncThunk(
  'recipientNotifications/fetchUnreadCount',
  async (token, { rejectWithValue }) => {
    try {
      const data = await getUnreadCount(token);
      return data.count ?? 0;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'recipientNotifications/fetchNotifications',
  async ({ token, page = 1, limit = 20, filter = 'all' }, { rejectWithValue }) => {
    try {
      return await getNotifications(token, { page, limit, filter });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markRead = createAsyncThunk(
  'recipientNotifications/markRead',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      await markNotificationRead(token, id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllRead = createAsyncThunk(
  'recipientNotifications/markAllRead',
  async (token, { rejectWithValue }) => {
    try {
      await markAllNotificationsRead(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const recipientNotificationsSlice = createSlice({
  name: 'recipientNotifications',
  initialState: {
    unreadCount: 0,
    notifications: [],
    total: 0,
    page: 1,
    limit: 20,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications ?? [];
        state.total = action.payload.total ?? 0;
        state.page = action.payload.page ?? 1;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.notification_id === action.payload);
        if (notif && !notif.is_read) {
          notif.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.is_read = true; });
        state.unreadCount = 0;
      });
  },
});

export default recipientNotificationsSlice.reducer;
export const selectUnreadCount = (state) => state.recipientNotifications.unreadCount;
export const selectNotifications = (state) => state.recipientNotifications.notifications;
export const selectNotifLoading = (state) => state.recipientNotifications.loading;
export const selectNotifTotal = (state) => state.recipientNotifications.total;
export const selectNotifPage = (state) => state.recipientNotifications.page;
