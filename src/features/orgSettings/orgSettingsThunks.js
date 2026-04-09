import { createAsyncThunk } from '@reduxjs/toolkit';
import { changePassword } from '../../api/org.api';

export const submitChangePassword = createAsyncThunk(
  'orgSettings/changePassword',
  async ({ token, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { success: _s, message } = await changePassword(token, { currentPassword, newPassword });
      return message;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
