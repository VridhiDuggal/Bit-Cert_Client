import { createSlice } from '@reduxjs/toolkit';
import {
  fetchIssueCertificates,
  submitIssueCertificate,
  fetchCertificateDetail,
  submitRevokeCertificate,
} from './orgIssueThunks';

const initialState = {
  certificates: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  loading: false,
  error: null,
  issuing: false,
  issueError: null,
  selectedCert: null,
  detailLoading: false,
  detailError: null,
  revoking: false,
  revokeError: null,
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
    clearSelectedCert(state) {
      state.selectedCert = null;
      state.detailError = null;
    },
    clearIssueError(state) {
      state.issueError = null;
    },
    clearRevokeError(state) {
      state.revokeError = null;
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
      });
  },
});

export const { setPage, setSearch, clearSelectedCert, clearIssueError, clearRevokeError } = orgIssueSlice.actions;
export default orgIssueSlice.reducer;
