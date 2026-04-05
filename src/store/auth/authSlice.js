import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  org: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.org = action.payload.org;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.org = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
