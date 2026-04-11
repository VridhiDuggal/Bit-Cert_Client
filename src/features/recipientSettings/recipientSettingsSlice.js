import { createSlice } from '@reduxjs/toolkit';
import { submitUpdateProfile, submitChangePassword, fetchRecipientProfile } from './recipientSettingsThunks';

const initialState = {
  savingProfile: false,
  profileError: null,
  savingPassword: false,
  passwordError: null,
  passwordSuccess: false,
  profile: null,
  profileLoading: false,
};

const recipientSettingsSlice = createSlice({
  name: 'recipientSettings',
  initialState,
  reducers: {
    clearProfileError(state) { state.profileError = null; },
    clearPasswordError(state) { state.passwordError = null; },
    clearPasswordSuccess(state) { state.passwordSuccess = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitUpdateProfile.pending, (state) => { state.savingProfile = true; state.profileError = null; })
      .addCase(submitUpdateProfile.fulfilled, (state) => { state.savingProfile = false; })
      .addCase(submitUpdateProfile.rejected, (state, action) => { state.savingProfile = false; state.profileError = action.payload; });

    builder
      .addCase(submitChangePassword.pending, (state) => { state.savingPassword = true; state.passwordError = null; state.passwordSuccess = false; })
      .addCase(submitChangePassword.fulfilled, (state) => { state.savingPassword = false; state.passwordSuccess = true; })
      .addCase(submitChangePassword.rejected, (state, action) => { state.savingPassword = false; state.passwordError = action.payload; });

    builder
      .addCase(fetchRecipientProfile.pending, (state) => { state.profileLoading = true; })
      .addCase(fetchRecipientProfile.fulfilled, (state, action) => { state.profileLoading = false; state.profile = action.payload; })
      .addCase(fetchRecipientProfile.rejected, (state) => { state.profileLoading = false; });
  },
});

export const { clearProfileError, clearPasswordError, clearPasswordSuccess } = recipientSettingsSlice.actions;
export default recipientSettingsSlice.reducer;
