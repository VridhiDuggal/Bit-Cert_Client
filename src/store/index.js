import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import toastReducer from './toast/toastSlice';
import orgDashboardReducer from '../features/orgDashboard/orgDashboardSlice';
import orgIssueReducer from '../features/orgIssue/orgIssueSlice';
import orgSettingsReducer from '../features/orgSettings/orgSettingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    orgDashboard: orgDashboardReducer,
    orgIssue: orgIssueReducer,
    orgSettings: orgSettingsReducer,
  },
});

