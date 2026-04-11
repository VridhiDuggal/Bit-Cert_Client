export const selectNotifications = (state) => state.recipientNotificationsFeature.notifications;
export const selectNotificationsTotal = (state) => state.recipientNotificationsFeature.total;
export const selectNotificationsPage = (state) => state.recipientNotificationsFeature.page;
export const selectNotificationsFilter = (state) => state.recipientNotificationsFeature.filter;
export const selectNotificationsLoading = (state) => state.recipientNotificationsFeature.loading;
export const selectUnreadCount = (state) => state.recipientNotificationsFeature.unreadCount;
