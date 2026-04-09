import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardStats, fetchDashboardTable } from './orgDashboardThunks';

const initialState = {
  stats: {
    total_certificates: 0,
    active_certificates: 0,
    revoked_certificates: 0,
    total_recipients: 0,
  },
  tableData: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  statsLoading: false,
  tableLoading: false,
  statsError: null,
  tableError: null,
};

const orgDashboardSlice = createSlice({
  name: 'orgDashboard',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })
      .addCase(fetchDashboardTable.pending, (state) => {
        state.tableLoading = true;
        state.tableError = null;
      })
      .addCase(fetchDashboardTable.fulfilled, (state, action) => {
        state.tableLoading = false;
        state.tableData = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchDashboardTable.rejected, (state, action) => {
        state.tableLoading = false;
        state.tableError = action.payload;
      });
  },
});

export const { setPage, setSearch } = orgDashboardSlice.actions;
export default orgDashboardSlice.reducer;
