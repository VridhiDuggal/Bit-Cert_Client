import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRecipientDashboardStats, getRecipientCertificates, getNotifications } from '../../api/recipient.api';
import { selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';

export const fetchRecipientStats = createAsyncThunk(
  'recipientDashboard/fetchStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const { success: _s, ...stats } = await getRecipientDashboardStats(token);
      return stats;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRecentCertificates = createAsyncThunk(
  'recipientDashboard/fetchRecentCertificates',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await getRecipientCertificates(token, { page: 1, limit: 3 });
      return data.certificates ?? data.data ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRecentNotifications = createAsyncThunk(
  'recipientDashboard/fetchRecentNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await getNotifications(token, { page: 1, limit: 3, filter: 'all' });
      return data.notifications ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
