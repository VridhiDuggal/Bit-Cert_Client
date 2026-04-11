import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStats, fetchCertificates, getDashboardActivity, getDashboardChart } from '../../api/orgDashboard.api';

export const fetchDashboardStats = createAsyncThunk(
  'orgDashboard/fetchStats',
  async (token, { rejectWithValue }) => {
    try {
      const { success: _s, ...stats } = await fetchStats(token);
      return stats;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDashboardTable = createAsyncThunk(
  'orgDashboard/fetchTable',
  async ({ token, page, limit, search }, { rejectWithValue }) => {
    try {
      const { success: _s, ...result } = await fetchCertificates(token, page, limit, search);
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDashboardActivity = createAsyncThunk(
  'orgDashboard/fetchActivity',
  async (token, { rejectWithValue }) => {
    try {
      const { activity } = await getDashboardActivity(token);
      return activity;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDashboardChart = createAsyncThunk(
  'orgDashboard/fetchChart',
  async (token, { rejectWithValue }) => {
    try {
      const { chart } = await getDashboardChart(token);
      return chart;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
