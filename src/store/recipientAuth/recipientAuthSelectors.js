export const selectIsRecipientAuthenticated = (state) => state.recipientAuth.isAuthenticated;
export const selectRecipientToken = (state) => state.recipientAuth.token;
export const selectRecipient = (state) => state.recipientAuth.recipient;
