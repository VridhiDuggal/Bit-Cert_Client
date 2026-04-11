export const selectAuditLogs      = (state) => state.orgAuditLogs.logs;
export const selectAuditTotal     = (state) => state.orgAuditLogs.total;
export const selectAuditPage      = (state) => state.orgAuditLogs.page;
export const selectAuditLimit     = (state) => state.orgAuditLogs.limit;
export const selectAuditLoading   = (state) => state.orgAuditLogs.loading;
export const selectAuditError     = (state) => state.orgAuditLogs.error;
export const selectAuditExporting = (state) => state.orgAuditLogs.exporting;
export const selectAuditFilters   = (state) => state.orgAuditLogs.filters;
