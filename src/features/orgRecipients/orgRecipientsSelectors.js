export const selectRecipients        = s => s.orgRecipients.recipients;
export const selectRecipientsTotal   = s => s.orgRecipients.total;
export const selectRecipientsPage    = s => s.orgRecipients.page;
export const selectRecipientsLimit   = s => s.orgRecipients.limit;
export const selectRecipientsSearch  = s => s.orgRecipients.search;
export const selectRecipientsFilters = s => s.orgRecipients.filters;
export const selectRecipientsLoading = s => s.orgRecipients.loading;
export const selectRecipientsError   = s => s.orgRecipients.error;

export const selectSelectedRecipient  = s => s.orgRecipients.selectedRecipient;
export const selectRecipientLoading   = s => s.orgRecipients.recipientLoading;
export const selectRecipientError     = s => s.orgRecipients.recipientError;

export const selectUpdating           = s => s.orgRecipients.updating;
export const selectUpdateError        = s => s.orgRecipients.updateError;

export const selectInviting           = s => s.orgRecipients.inviting;
export const selectInviteError        = s => s.orgRecipients.inviteError;
