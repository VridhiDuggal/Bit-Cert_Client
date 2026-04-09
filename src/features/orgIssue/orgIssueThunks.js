import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  issueCertificate,
  fetchCertificates,
  fetchCertificateById,
} from '../../api/orgIssue.api';
import { revokeCertificate } from '../../api/org.api';

export const fetchIssueCertificates = createAsyncThunk(
  'orgIssue/fetchCertificates',
  async ({ token, page, limit, search }, { rejectWithValue }) => {
    try {
      const { success: _s, ...result } = await fetchCertificates(token, page, limit, search);
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
