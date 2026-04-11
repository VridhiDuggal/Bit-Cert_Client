export const selectSettingsSaving      = (state) => state.orgSettings.saving;
export const selectSettingsError       = (state) => state.orgSettings.error;
export const selectSettingsProfile     = (state) => state.orgSettings.profile;
export const selectProfileLoading      = (state) => state.orgSettings.profileLoading;
export const selectProfileSaving       = (state) => state.orgSettings.profileSaving;
export const selectProfileError        = (state) => state.orgSettings.profileError;
export const selectNotifications       = (state) => state.orgSettings.notifications;
export const selectNotifTotal          = (state) => state.orgSettings.notifTotal;
export const selectNotifPage           = (state) => state.orgSettings.notifPage;
export const selectNotifLoading        = (state) => state.orgSettings.notifLoading;
export const selectUnreadCount         = (state) => state.orgSettings.unreadCount;

