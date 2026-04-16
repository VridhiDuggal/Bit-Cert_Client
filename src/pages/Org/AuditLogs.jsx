import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClipboardList, Download } from 'lucide-react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { PageTransition } from '../../components/shared/PageTransition';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { FilterBar } from '../../components/ui/FilterBar';
import { selectToken } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';
import { fetchAuditLogs, runExportAuditLogs } from '../../features/orgAuditLogs/orgAuditLogsThunks';
import {
  selectAuditLogs, selectAuditTotal, selectAuditPage, selectAuditLimit,
  selectAuditLoading, selectAuditError, selectAuditExporting, selectAuditFilters,
} from '../../features/orgAuditLogs/orgAuditLogsSelectors';
import { setPage, setFilters, resetFilters, clearAuditError } from '../../features/orgAuditLogs/orgAuditLogsSlice';
import { PRIMARY, BORDER, TEXT, MUTED, SURFACE, SURFACE_HOVER, BG_SUBTLE, SHADOW, SPACING, RADIUS, DURATION, DANGER, WARNING, INFO, SUCCESS } from '../../styles/tokens';

const ACTION_LABELS = {
  ISSUE:                'Certificate Issued',
  REVOKE:               'Certificate Revoked',
  INVITE:               'Invite Sent',
  RECIPIENT_CREATED:    'Recipient Created',
  RESEND:               'Invite Resent',
  RECIPIENT_SUSPEND:    'Recipient Suspended',
  RECIPIENT_UNSUSPEND:  'Recipient Unsuspended',
};

const ACTION_VARIANTS = {
  ISSUE:               'success',
  REVOKE:              'danger',
  INVITE:              'info',
  RECIPIENT_CREATED:   'info',
  RESEND:              'neutral',
  RECIPIENT_SUSPEND:   'warning',
  RECIPIENT_UNSUSPEND: 'success',
};

const ACTION_OPTIONS = [
  { value: 'all',                label: 'All Actions' },
  { value: 'ISSUE',              label: 'Certificate Issued' },
  { value: 'REVOKE',             label: 'Certificate Revoked' },
  { value: 'INVITE',             label: 'Invite Sent' },
  { value: 'RECIPIENT_CREATED',  label: 'Recipient Created' },
  { value: 'RESEND',             label: 'Invite Resent' },
  { value: 'RECIPIENT_SUSPEND',  label: 'Recipient Suspended' },
  { value: 'RECIPIENT_UNSUSPEND',label: 'Recipient Unsuspended' },
];

const FILTERS_CONFIG = [
  { key: 'action', label: 'Action', type: 'select', options: ACTION_OPTIONS },
];

function truncate(str, n = 24) {
  if (!str) return '—';
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

function formatTs(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AuditLogs() {
  const dispatch  = useDispatch();
  const token     = useSelector(selectToken);
  const toast     = useToast();
  const logs      = useSelector(selectAuditLogs);
  const total     = useSelector(selectAuditTotal);
  const page      = useSelector(selectAuditPage);
  const limit     = useSelector(selectAuditLimit);
  const loading   = useSelector(selectAuditLoading);
  const error     = useSelector(selectAuditError);
  const exporting = useSelector(selectAuditExporting);
  const filters   = useSelector(selectAuditFilters);

  const load = useCallback(() => {
    dispatch(fetchAuditLogs({ token, page, limit, filters }));
  }, [dispatch, token, page, limit, filters]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearAuditError()); }
  }, [error, toast, dispatch]);

  function handleFilterChange(key, value) {
    dispatch(setFilters({ [key]: value === 'all' ? '' : value }));
  }

  function handleReset() { dispatch(resetFilters()); }

  async function handleExport() {
    const result = await dispatch(runExportAuditLogs({ token, filters }));
    if (runExportAuditLogs.rejected.match(result)) toast.error(result.payload ?? 'Export failed.');
  }

  const start    = (page - 1) * limit + 1;
  const end      = Math.min(page * limit, total);
  const hasPrev  = page > 1;
  const hasNext  = page * limit < total;
  const isEmpty  = !loading && logs.length === 0;

  return (
    <OrgLayout>
      <PageTransition>
      <PageHeader
        title="Audit Logs"
        subtitle="All actions taken within your organisation."
        actions={[{
          label: exporting ? 'Exporting…' : 'Export CSV',
          icon: Download,
          variant: 'outline',
          onClick: handleExport,
        }]}
      />

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: SPACING.md, flexWrap: 'wrap', marginBottom: SPACING.lg }}>
        <FilterBar
          filters={FILTERS_CONFIG}
          values={{ action: filters.action || 'all' }}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6 }}>From Date</label>
          <input
            type="date"
            value={filters.date_from ?? ''}
            onChange={e => handleFilterChange('date_from', e.target.value)}
            style={{ border: `1.5px solid ${BORDER}`, borderRadius: RADIUS.md, padding: '7px 12px', fontSize: 13, color: TEXT, backgroundColor: '#fff' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6 }}>To Date</label>
          <input
            type="date"
            value={filters.date_to ?? ''}
            onChange={e => handleFilterChange('date_to', e.target.value)}
            style={{ border: `1.5px solid ${BORDER}`, borderRadius: RADIUS.md, padding: '7px 12px', fontSize: 13, color: TEXT, backgroundColor: '#fff' }}
          />
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: RADIUS.lg,
        border: `1px solid ${BORDER}`,
        overflow: 'hidden',
        boxShadow: SHADOW.sm,
        position: 'relative',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: BG_SUBTLE, borderBottom: `1px solid ${BORDER}` }}>
                {['Event', 'Target', 'Performed By', 'When'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && isEmpty && (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={ClipboardList}
                      title="No activity yet"
                      description="Events like issuing certificates and sending invites will appear here."
                    />
                  </td>
                </tr>
              )}
              {logs.map((row) => (
                <tr
                  key={row.log_id ?? row.id}
                  style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff', transition: `background ${DURATION.fast}` }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = SURFACE_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                >
                  <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                    <Badge variant={ACTION_VARIANTS[row.action] ?? 'neutral'}>
                      {ACTION_LABELS[row.action] ?? row.action}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 16px', color: TEXT, verticalAlign: 'middle', maxWidth: 200 }}>
                    {row.target && row.target.length > 24 ? (
                      <Tooltip content={row.target}>
                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{truncate(row.target)}</span>
                      </Tooltip>
                    ) : (
                      <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{row.target ?? '—'}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', color: MUTED, verticalAlign: 'middle', fontSize: 12 }}>
                    {row.performed_by ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: MUTED, verticalAlign: 'middle', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {formatTs(row.timestamp ?? row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <Loader size="md" />
          </div>
        )}

        {total > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: `1px solid ${BORDER}`, backgroundColor: BG_SUBTLE }}>
            <span style={{ fontSize: 12, color: MUTED }}>Showing {start}–{end} of {total}</span>
            <div style={{ display: 'flex', gap: SPACING.sm }}>
              <button onClick={() => dispatch(setPage(page - 1))} disabled={!hasPrev} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: RADIUS.sm, border: `1.5px solid ${BORDER}`, backgroundColor: '#fff', color: hasPrev ? TEXT : MUTED, cursor: hasPrev ? 'pointer' : 'not-allowed', opacity: hasPrev ? 1 : 0.5 }}>← Previous</button>
              <button onClick={() => dispatch(setPage(page + 1))} disabled={!hasNext} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: RADIUS.sm, border: `1.5px solid ${BORDER}`, backgroundColor: '#fff', color: hasNext ? TEXT : MUTED, cursor: hasNext ? 'pointer' : 'not-allowed', opacity: hasNext ? 1 : 0.5 }}>Next →</button>
            </div>
          </div>
        )}
      </div>
      </PageTransition>
    </OrgLayout>
  );
}
