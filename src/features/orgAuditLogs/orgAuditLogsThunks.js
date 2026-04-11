import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAuditLogs, exportAuditLogs } from '../../api/org.api';

export const fetchAuditLogs = createAsyncThunk(
  'orgAuditLogs/fetch',
  async ({ token, page, limit, filters }, { rejectWithValue }) => {
    try {
      return await getAuditLogs(token, { page, limit, ...filters });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const runExportAuditLogs = createAsyncThunk(
  'orgAuditLogs/export',
  async ({ token, filters }, { rejectWithValue }) => {
    try {
      const blob = await exportAuditLogs(token, filters);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
