import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OrgLayout } from '../../components/org/OrgLayout';
import { Table } from '../../components/ui/Table';
import { getCertificates } from '../../api/org.api';
import { selectToken } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';
import { PRIMARY } from '../../styles/tokens';

const LIMIT = 10;

const columns = [
  { key: 'recipient_name', label: 'Recipient' },
  {
    key: 'issued_at',
    label: 'Issued',
    render: (row) => row.issued_at ? new Date(row.issued_at).toLocaleDateString() : '—',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        backgroundColor: row.status === 'active' ? '#f0fdf4' : '#fef2f2',
        color: row.status === 'active' ? '#166534' : '#991b1b',
      }}>
        {row.status === 'active' ? 'Active' : 'Revoked'}
      </span>
    ),
  },
];

export default function Certificates() {
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
        const res = await getCertificates(token, page, LIMIT);
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
    <OrgLayout title="Certificates" subtitle="All certificates issued by your organisation.">
      <Table
        columns={columns}
        data={data}
        total={total}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No certificates issued yet."
      />
    </OrgLayout>
  );
}
