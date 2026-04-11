import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import toastReducer from './toast/toastSlice';
import orgDashboardReducer from '../features/orgDashboard/orgDashboardSlice';
import orgIssueReducer from '../features/orgIssue/orgIssueSlice';
import orgSettingsReducer from '../features/orgSettings/orgSettingsSlice';
import orgRecipientsReducer from '../features/orgRecipients/orgRecipientsSlice';
import orgAuditLogsReducer from '../features/orgAuditLogs/orgAuditLogsSlice';
import recipientAuthReducer from './recipientAuth/recipientAuthSlice';
import recipientNotificationsReducer from './recipientNotifications/recipientNotificationsSlice';
import recipientDashboardReducer from '../features/recipientDashboard/recipientDashboardSlice';
import recipientNotificationsFeatureReducer from '../features/recipientNotifications/recipientNotificationsSlice';
import recipientCertificatesReducer from '../features/recipientCertificates/recipientCertificatesSlice';
import recipientSettingsReducer from '../features/recipientSettings/recipientSettingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    orgDashboard: orgDashboardReducer,
    orgIssue: orgIssueReducer,
    orgSettings: orgSettingsReducer,
    orgRecipients: orgRecipientsReducer,
    orgAuditLogs: orgAuditLogsReducer,
    recipientAuth: recipientAuthReducer,
    recipientNotifications: recipientNotificationsReducer,
    recipientDashboard: recipientDashboardReducer,
    recipientNotificationsFeature: recipientNotificationsFeatureReducer,
    recipientCertificates: recipientCertificatesReducer,
    recipientSettings: recipientSettingsReducer,
  },
});

