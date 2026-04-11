import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRecipientCertificates,
  getRecipientCertificate,
  getVerificationHistory,
} from '../../api/recipient.api';
import { selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';

export const fetchRecipientCertificates = createAsyncThunk(
  'recipientCertificates/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const { page, limit, search, statusFilter } = getState().recipientCertificates;
      const data = await getRecipientCertificates(token, { page, limit, search, status: statusFilter });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCertificateDetail = createAsyncThunk(
  'recipientCertificates/fetchDetail',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await getRecipientCertificate(token, id);
      return data.certificate ?? data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchVerificationHistory = createAsyncThunk(
  'recipientCertificates/fetchVerificationHistory',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = selectRecipientToken(getState());
      const data = await getVerificationHistory(token, id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
