import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  changePassword, getOrgProfile, updateOrgProfile,
  getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount,
} from '../../api/org.api';

export const submitChangePassword = createAsyncThunk(
  'orgSettings/changePassword',
  async ({ token, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { message } = await changePassword(token, { currentPassword, newPassword });
      return message;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrgProfile = createAsyncThunk(
  'orgSettings/fetchProfile',
  async (token, { rejectWithValue }) => {
    try {
      const data = await getOrgProfile(token);
      return data.org ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitUpdateProfile = createAsyncThunk(
  'orgSettings/updateProfile',
  async ({ token, ...fields }, { rejectWithValue }) => {
    try {
      const data = await updateOrgProfile(token, fields);
      return data.org ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'orgSettings/fetchNotifications',
  async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await getNotifications(token, page, limit);
      return { notifications: data.notifications ?? data.data ?? [], total: data.total ?? 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitMarkNotificationRead = createAsyncThunk(
  'orgSettings/markNotificationRead',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const data = await markNotificationRead(token, id);
      return data.notification;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitMarkAllNotificationsRead = createAsyncThunk(
  'orgSettings/markAllNotificationsRead',
  async (token, { rejectWithValue }) => {
    try {
      await markAllNotificationsRead(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'orgSettings/fetchUnreadCount',
  async (token, { rejectWithValue }) => {
    try {
      const data = await getUnreadCount(token);
      return data.count ?? 0;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

