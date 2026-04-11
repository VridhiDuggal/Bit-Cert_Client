import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  issueCertificate,
  fetchCertificates,
  fetchCertificateById,
  getVerificationHistory,
  resendCertificate,
  searchRecipients,
} from '../../api/orgIssue.api';
import { revokeCertificate } from '../../api/org.api';

export const fetchIssueCertificates = createAsyncThunk(
  'orgIssue/fetchCertificates',
  async ({ token, page, limit, filters }, { rejectWithValue }) => {
    try {
      const { success: _s, ...result } = await fetchCertificates(token, page, limit, filters ?? {});
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitIssueCertificate = createAsyncThunk(
  'orgIssue/issue',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const { success: _s, ...result } = await issueCertificate(token, data);
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCertificateDetail = createAsyncThunk(
  'orgIssue/fetchDetail',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const { success: _s, certificate } = await fetchCertificateById(token, id);
      return certificate;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitRevokeCertificate = createAsyncThunk(
  'orgIssue/revoke',
  async ({ token, cert_hash, password }, { rejectWithValue }) => {
    try {
      await revokeCertificate(token, cert_hash, password);
      return cert_hash;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchVerificationHistory = createAsyncThunk(
  'orgIssue/fetchVerificationHistory',
  async ({ token, certId, page }, { rejectWithValue }) => {
    try {
      const { success: _s, ...result } = await getVerificationHistory(token, certId, page);
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitResendCertificate = createAsyncThunk(
  'orgIssue/resend',
  async ({ token, certId }, { rejectWithValue }) => {
    try {
      const result = await resendCertificate(token, certId);
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRecipientSearch = createAsyncThunk(
  'orgIssue/searchRecipients',
  async ({ token, query }, { rejectWithValue }) => {
    try {
      const res = await searchRecipients(token, query);
      return res.data ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
