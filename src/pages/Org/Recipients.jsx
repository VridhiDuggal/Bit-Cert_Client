import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OrgLayout } from '../../components/org/OrgLayout';
import { Table } from '../../components/ui/Table';
import { getRecipients } from '../../api/org.api';
import { selectToken } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';

const LIMIT = 10;

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  {
    key: 'created_at',
    label: 'Joined',
    render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '—',
  },
];

export default function Recipients() {
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
        const res = await getRecipients(token, page, LIMIT);
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
    <OrgLayout title="Recipients" subtitle="All recipients registered under your organisation.">
      <Table
        columns={columns}
        data={data}
        total={total}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No recipients yet."
      />
    </OrgLayout>
  );
}
