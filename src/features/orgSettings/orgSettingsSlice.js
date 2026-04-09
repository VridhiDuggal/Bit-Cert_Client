import { createSlice } from '@reduxjs/toolkit';
import { submitChangePassword } from './orgSettingsThunks';

const initialState = {
  saving: false,
  error: null,
};

const orgSettingsSlice = createSlice({
  name: 'orgSettings',
  initialState,
  reducers: {
    clearSettingsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitChangePassword.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(submitChangePassword.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(submitChangePassword.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettingsError } = orgSettingsSlice.actions;
export default orgSettingsSlice.reducer;
