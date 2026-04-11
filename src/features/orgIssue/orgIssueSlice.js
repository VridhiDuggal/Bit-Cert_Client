import { createSlice } from '@reduxjs/toolkit';
import {
  fetchIssueCertificates,
  submitIssueCertificate,
  fetchCertificateDetail,
  submitRevokeCertificate,
  fetchVerificationHistory,
  submitResendCertificate,
  fetchRecipientSearch,
} from './orgIssueThunks';

const initialState = {
  certificates: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  filters: {
    tags: [],
    expiry_status: '',
    status: '',
    date_from: '',
    date_to: '',
  },
  loading: false,
  error: null,
  issuing: false,
  issueError: null,
  selectedCert: null,
  detailLoading: false,
  detailError: null,
  revoking: false,
  revokeError: null,
  verificationHistory: [],
  vhLoading: false,
  vhTotal: 0,
  vhPage: 1,
  vhError: null,
  resending: false,
  resendError: null,
  recipientResults: [],
  recipientSearchLoading: false,
};

const orgIssueSlice = createSlice({
  name: 'orgIssue',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = { tags: [], expiry_status: '', status: '', date_from: '', date_to: '' };
      state.search = '';
      state.page = 1;
    },
    setVhPage(state, action) {
      state.vhPage = action.payload;
    },
    clearSelectedCert(state) {
      state.selectedCert = null;
      state.detailError = null;
      state.verificationHistory = [];
      state.vhTotal = 0;
      state.vhPage = 1;
    },
    clearIssueError(state) {
      state.issueError = null;
    },
    clearRevokeError(state) {
      state.revokeError = null;
    },
    clearResendError(state) {
      state.resendError = null;
    },
    clearRecipientResults(state) {
      state.recipientResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssueCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchIssueCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitIssueCertificate.pending, (state) => {
        state.issuing = true;
        state.issueError = null;
      })
      .addCase(submitIssueCertificate.fulfilled, (state) => {
        state.issuing = false;
      })
      .addCase(submitIssueCertificate.rejected, (state, action) => {
        state.issuing = false;
        state.issueError = action.payload;
      })
      .addCase(fetchCertificateDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedCert = null;
      })
      .addCase(fetchCertificateDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedCert = action.payload;
      })
      .addCase(fetchCertificateDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      .addCase(submitRevokeCertificate.pending, (state) => {
        state.revoking = true;
        state.revokeError = null;
      })
      .addCase(submitRevokeCertificate.fulfilled, (state, action) => {
        state.revoking = false;
        const hash = action.payload;
        state.certificates = state.certificates.map(c =>
          c.cert_hash === hash ? { ...c, is_revoked: true } : c
        );
        if (state.selectedCert?.cert_hash === hash) {
          state.selectedCert = { ...state.selectedCert, is_revoked: true };
        }
      })
      .addCase(submitRevokeCertificate.rejected, (state, action) => {
        state.revoking = false;
        state.revokeError = action.payload;
      })
      .addCase(fetchVerificationHistory.pending, (state) => {
        state.vhLoading = true;
        state.vhError = null;
      })
      .addCase(fetchVerificationHistory.fulfilled, (state, action) => {
        state.vhLoading = false;
        state.verificationHistory = action.payload.logs;
        state.vhTotal = action.payload.total;
        state.vhPage = action.payload.page;
      })
      .addCase(fetchVerificationHistory.rejected, (state, action) => {
        state.vhLoading = false;
        state.vhError = action.payload;
      })
      .addCase(submitResendCertificate.pending, (state) => {
        state.resending = true;
        state.resendError = null;
      })
      .addCase(submitResendCertificate.fulfilled, (state) => {
        state.resending = false;
      })
      .addCase(submitResendCertificate.rejected, (state, action) => {
        state.resending = false;
        state.resendError = action.payload;
      })
      .addCase(fetchRecipientSearch.pending, (state) => {
        state.recipientSearchLoading = true;
      })
      .addCase(fetchRecipientSearch.fulfilled, (state, action) => {
        state.recipientSearchLoading = false;
        state.recipientResults = action.payload;
      })
      .addCase(fetchRecipientSearch.rejected, (state) => {
        state.recipientSearchLoading = false;
        state.recipientResults = [];
      });
  },
});

export const { setPage, setSearch, setFilters, resetFilters, setVhPage, clearSelectedCert, clearIssueError, clearRevokeError, clearResendError, clearRecipientResults } = orgIssueSlice.actions;
export default orgIssueSlice.reducer;
