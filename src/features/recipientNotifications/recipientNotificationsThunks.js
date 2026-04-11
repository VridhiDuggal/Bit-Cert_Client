import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead as apiMarkRead,
  markAllNotificationsRead as apiMarkAllRead,
} from '../../api/recipient.api';
import { selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';

export const fetchNotifications = createAsyncThunk(
  'recipientNotificationsFeature/fetchNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const { page, filter } = getState().recipientNotificationsFeature;
      return await getNotifications(token, { page, limit: 20, filter });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'recipientNotificationsFeature/fetchUnreadCount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await getUnreadCount(token);
      return data.count ?? 0;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'recipientNotificationsFeature/markNotificationRead',
  async (notification_id, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      await apiMarkRead(token, notification_id);
      return notification_id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'recipientNotificationsFeature/markAllNotificationsRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      await apiMarkAllRead(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
