import { createSlice } from '@reduxjs/toolkit';
import { fetchAuditLogs, runExportAuditLogs } from './orgAuditLogsThunks';

const initialState = {
  logs:      [],
  total:     0,
  page:      1,
  limit:     15,
  loading:   false,
  error:     null,
  exporting: false,
  filters: {
    action:    '',
    target:    '',
    date_from: '',
    date_to:   '',
  },
};

const orgAuditLogsSlice = createSlice({
  name: 'orgAuditLogs',
  initialState,
  reducers: {
    setPage(state, action)    { state.page = action.payload; },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.page = 1;
    },
    clearAuditError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs    = action.payload.data;
        state.total   = action.payload.total;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      .addCase(runExportAuditLogs.pending, (state)  => { state.exporting = true; })
      .addCase(runExportAuditLogs.fulfilled, (state) => { state.exporting = false; })
      .addCase(runExportAuditLogs.rejected, (state)  => { state.exporting = false; });
  },
});

export const { setPage, setFilters, resetFilters, clearAuditError } = orgAuditLogsSlice.actions;
export default orgAuditLogsSlice.reducer;
