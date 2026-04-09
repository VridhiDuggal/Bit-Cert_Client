import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, CheckCircle, XCircle, Users } from 'lucide-react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { Table } from '../../components/ui/Table';
import { Loader } from '../../components/ui/Loader';
import { selectToken } from '../../store/auth/authSelectors';
import { fetchDashboardStats, fetchDashboardTable } from '../../features/orgDashboard/orgDashboardThunks';
import { setPage, setSearch } from '../../features/orgDashboard/orgDashboardSlice';
import {
  selectDashboardStats,
  selectDashboardTableData,
  selectDashboardTotal,
  selectDashboardPage,
  selectDashboardLimit,
  selectDashboardSearch,
  selectDashboardStatsLoading,
  selectDashboardTableLoading,
  selectDashboardStatsError,
  selectDashboardTableError,
} from '../../features/orgDashboard/orgDashboardSelectors';
import { PRIMARY, BORDER, TEXT, MUTED, BG_SUBTLE } from '../../styles/tokens';

const STAT_CARDS = [
  { key: 'total_certificates',  label: 'Total Certificates', Icon: FileText   },
  { key: 'active_certificates', label: 'Active',             Icon: CheckCircle },
  { key: 'revoked_certificates',label: 'Revoked',            Icon: XCircle     },
  { key: 'total_recipients',    label: 'Total Recipients',   Icon: Users       },
];

const TABLE_COLUMNS = [
  { key: 'recipient_name', label: 'Recipient' },
  { key: 'course',         label: 'Course'    },
  {
    key: 'issued_at',
    label: 'Issued',
    render: (row) => row.issued_at ? new Date(row.issued_at).toLocaleDateString() : '—',
  },
  {
    key: 'is_revoked',
    label: 'Status',
    render: (row) => (
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        backgroundColor: row.is_revoked ? '#fef2f2' : '#f0fdf4',
        color:           row.is_revoked ? '#991b1b'  : '#166534',
      }}>
        {row.is_revoked ? 'Revoked' : 'Active'}
      </span>
    ),
  },
];

function StatCard({ label, value, Icon, loading }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: 14,
      border: `1px solid ${BORDER}`,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </span>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          borderRadius: 9,
          backgroundColor: BG_SUBTLE,
          border: `1px solid ${BORDER}`,
        }}>
          <Icon size={16} color={PRIMARY} strokeWidth={2} />
        </span>
      </div>
      {loading
        ? <Loader size="sm" />
        : <span style={{ fontSize: 30, fontWeight: 800, color: TEXT, letterSpacing: -1, lineHeight: 1 }}>
            {(value ?? 0).toLocaleString()}
          </span>
      }
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 13,
      color: '#991b1b',
    }}>
      {message}
    </div>
  );
}

export default function OrgDashboard() {
  const dispatch = useDispatch();
  const token          = useSelector(selectToken);
  const stats          = useSelector(selectDashboardStats);
  const tableData      = useSelector(selectDashboardTableData);
  const total          = useSelector(selectDashboardTotal);
  const page           = useSelector(selectDashboardPage);
  const limit          = useSelector(selectDashboardLimit);
  const search         = useSelector(selectDashboardSearch);
  const statsLoading   = useSelector(selectDashboardStatsLoading);
  const tableLoading   = useSelector(selectDashboardTableLoading);
  const statsError     = useSelector(selectDashboardStatsError);
  const tableError     = useSelector(selectDashboardTableError);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    dispatch(fetchDashboardStats(token));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(fetchDashboardTable({ token, page, limit, search }));
  }, [dispatch, token, page, limit, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearch(searchInput));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const handlePageChange = useCallback((newPage) => {
    dispatch(setPage(newPage));
  }, [dispatch]);

  return (
    <OrgLayout title="Dashboard" subtitle="Overview of your organisation's activity">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {statsError && <ErrorBanner message={statsError} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STAT_CARDS.map(({ key, label, Icon }) => (
            <StatCard
              key={key}
              label={label}
              value={stats[key]}
              Icon={Icon}
              loading={statsLoading}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>Recent Certificates</h2>
              <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0' }}>All certificates issued by your organisation</p>
            </div>
            <input
              type="text"
              placeholder="Search recipient or course…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                border: `1.5px solid ${BORDER}`,
                borderRadius: 9,
                padding: '8px 14px',
                fontSize: 13,
                color: TEXT,
                backgroundColor: '#fff',
                outline: 'none',
                width: 260,
              }}
            />
          </div>

          {tableError && <ErrorBanner message={tableError} />}

          <Table
            columns={TABLE_COLUMNS}
            data={tableData}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            loading={tableLoading}
            emptyMessage="No certificates found."
          />
        </div>

      </div>
    </OrgLayout>
  );
}
