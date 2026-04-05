import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OrgLayout } from '../../components/org/OrgLayout';
import { Table } from '../../components/ui/Table';
import { getAuditLogs } from '../../api/org.api';
import { selectToken } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';

const LIMIT = 10;

const ACTION_LABELS = {
  ISSUE: 'Certificate Issued',
  REVOKE: 'Certificate Revoked',
  RECIPIENT_CREATED: 'Recipient Created',
};

const columns = [
  {
    key: 'action',
    label: 'Event',
    render: (row) => ACTION_LABELS[row.action] ?? row.action,
  },
  { key: 'target', label: 'Target' },
  {
    key: 'timestamp',
    label: 'When',
    render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString() : '—',
  },
];

export default function AuditLogs() {
  const token = useSelector(selectToken);
  const toast = useToast();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      try {
        const res = await getAuditLogs(token, page, LIMIT);
        if (!cancelled) {
          setData(res.data);
          setTotal(res.total);
        }
      } catch (err) {
        if (!cancelled) toast.error(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [page, token]);

  return (
    <OrgLayout title="Audit Logs" subtitle="Immutable record of all organisation activity.">
      <Table
        columns={columns}
        data={data}
        total={total}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No activity recorded yet."
      />
    </OrgLayout>
  );
}
