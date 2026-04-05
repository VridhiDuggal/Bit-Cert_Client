export const selectToken = (state) => state.auth.token;
export const selectOrg = (state) => state.auth.org;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectOrgName = (state) => state.auth.org?.org_name ?? '';
