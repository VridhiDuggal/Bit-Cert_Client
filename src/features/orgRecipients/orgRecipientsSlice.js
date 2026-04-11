import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRecipients,
  fetchRecipientDetail,
  updateRecipientThunk,
  submitInvite,
  submitBulkInvite,
} from './orgRecipientsThunks';

const initialState = {
  recipients: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  filters: { status: '' },
  loading: false,
  error: null,
  selectedRecipient: null,
  recipientLoading: false,
  recipientError: null,
  updating: false,
  updateError: null,
  inviting: false,
  inviteError: null,
};

const orgRecipientsSlice = createSlice({
  name: 'orgRecipients',
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
    setSelectedRecipient(state, action) {
      state.selectedRecipient = action.payload;
    },
    clearSelectedRecipient(state) {
      state.selectedRecipient = null;
      state.recipientError = null;
    },
    clearUpdateError(state) {
      state.updateError = null;
    },
    clearInviteError(state) {
      state.inviteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.recipients = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRecipientDetail.pending, (state) => {
        state.recipientLoading = true;
        state.recipientError = null;
      })
      .addCase(fetchRecipientDetail.fulfilled, (state, action) => {
        state.recipientLoading = false;
        state.selectedRecipient = action.payload.recipient;
      })
      .addCase(fetchRecipientDetail.rejected, (state, action) => {
        state.recipientLoading = false;
        state.recipientError = action.payload;
      })

      .addCase(updateRecipientThunk.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateRecipientThunk.fulfilled, (state, action) => {
        state.updating = false;
        const updated = action.payload.recipient;
        state.selectedRecipient = updated;
        const idx = state.recipients.findIndex(r => r.recipient_id === updated.recipient_id);
        if (idx !== -1) {
          state.recipients[idx] = { ...state.recipients[idx], ...updated };
        }
      })
      .addCase(updateRecipientThunk.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })

      .addCase(submitInvite.pending, (state) => {
        state.inviting = true;
        state.inviteError = null;
      })
      .addCase(submitInvite.fulfilled, (state) => {
        state.inviting = false;
      })
      .addCase(submitInvite.rejected, (state, action) => {
        state.inviting = false;
        state.inviteError = action.payload;
      })

      .addCase(submitBulkInvite.pending, (state) => {
        state.inviting = true;
        state.inviteError = null;
      })
      .addCase(submitBulkInvite.fulfilled, (state) => {
        state.inviting = false;
      })
      .addCase(submitBulkInvite.rejected, (state, action) => {
        state.inviting = false;
        state.inviteError = action.payload;
      });
  },
});

export const {
  setPage,
  setSearch,
  setFilters,
  setSelectedRecipient,
  clearSelectedRecipient,
  clearUpdateError,
  clearInviteError,
} = orgRecipientsSlice.actions;

export default orgRecipientsSlice.reducer;
