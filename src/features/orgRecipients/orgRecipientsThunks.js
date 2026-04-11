import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRecipients, getRecipientDetail, updateRecipient, sendInvite, sendBulkInvite } from '../../api/orgRecipients.api';

export const fetchRecipients = createAsyncThunk(
  'orgRecipients/fetchRecipients',
  async ({ token, page, limit, search, filters }, { rejectWithValue }) => {
    try {
      return await getRecipients(token, { page, limit, search, filters });
    } catch (err) {
      return rejectWithValue(err.data?.message ?? err.message);
    }
  }
);

export const fetchRecipientDetail = createAsyncThunk(
  'orgRecipients/fetchRecipientDetail',
  async ({ token, recipientId }, { rejectWithValue }) => {
    try {
      return await getRecipientDetail(token, recipientId);
    } catch (err) {
      return rejectWithValue(err.data?.message ?? err.message);
    }
  }
);

export const updateRecipientThunk = createAsyncThunk(
  'orgRecipients/updateRecipient',
  async ({ token, id, data }, { rejectWithValue }) => {
    try {
      return await updateRecipient(token, id, data);
    } catch (err) {
      return rejectWithValue(err.data?.message ?? err.message);
    }
  }
);

export const submitInvite = createAsyncThunk(
  'orgRecipients/submitInvite',
  async ({ token, email }, { rejectWithValue }) => {
    try {
      return await sendInvite(token, email);
    } catch (err) {
      return rejectWithValue(err.data?.message ?? err.message ?? (err.status === 409 ? 'An invite was already sent to this address.' : null));
    }
  }
);

export const submitBulkInvite = createAsyncThunk(
  'orgRecipients/submitBulkInvite',
  async ({ token, invites }, { rejectWithValue }) => {
    try {
      return await sendBulkInvite(token, invites);
    } catch (err) {
      return rejectWithValue(err.data?.message ?? err.message);
    }
  }
);
