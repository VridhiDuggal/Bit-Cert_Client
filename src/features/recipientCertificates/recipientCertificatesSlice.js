import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRecipientCertificates,
  fetchCertificateDetail,
  fetchVerificationHistory,
  fetchRecipientOrgs,
} from './recipientCertificatesThunks';

const initialState = {
  certificates: [],
  total: 0,
  page: 1,
  limit: 12,
  search: '',
  statusFilter: '',
  orgFilter: '',
  orgList: [],
  orgListLoading: false,
  loading: false,
  error: null,
  selectedCert: null,
  selectedCertLoading: false,
  selectedCertError: null,
  verificationHistory: null,
  verificationHistoryLoading: false,
};

const recipientCertificatesSlice = createSlice({
  name: 'recipientCertificates',
  initialState,
  reducers: {
    setPage(state, action) { state.page = action.payload; },
    setSearch(state, action) { state.search = action.payload; state.page = 1; },
    setStatusFilter(state, action) { state.statusFilter = action.payload; state.page = 1; },
    setOrgFilter(state, action) { state.orgFilter = action.payload; state.page = 1; },
    clearSelectedCert(state) {
      state.selectedCert = null;
      state.selectedCertError = null;
      state.verificationHistory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipientCertificates.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecipientCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.certificates ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(fetchRecipientCertificates.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(fetchCertificateDetail.pending, (state) => { state.selectedCertLoading = true; state.selectedCertError = null; })
      .addCase(fetchCertificateDetail.fulfilled, (state, action) => {
        state.selectedCertLoading = false;
        state.selectedCert = action.payload;
      })
      .addCase(fetchCertificateDetail.rejected, (state, action) => { state.selectedCertLoading = false; state.selectedCertError = action.payload; });

    builder
      .addCase(fetchVerificationHistory.pending, (state) => { state.verificationHistoryLoading = true; })
      .addCase(fetchVerificationHistory.fulfilled, (state, action) => {
        state.verificationHistoryLoading = false;
        state.verificationHistory = action.payload;
      })
      .addCase(fetchVerificationHistory.rejected, (state) => { state.verificationHistoryLoading = false; });

    builder
      .addCase(fetchRecipientOrgs.pending, (state) => { state.orgListLoading = true; })
      .addCase(fetchRecipientOrgs.fulfilled, (state, action) => {
        state.orgListLoading = false;
        state.orgList = action.payload ?? [];
      })
      .addCase(fetchRecipientOrgs.rejected, (state) => { state.orgListLoading = false; });
  },
});

export const { setPage, setSearch, setStatusFilter, setOrgFilter, clearSelectedCert } = recipientCertificatesSlice.actions;
export default recipientCertificatesSlice.reducer;
