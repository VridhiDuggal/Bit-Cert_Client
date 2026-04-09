import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { selectToken } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';
import {
  fetchIssueCertificates,
  submitIssueCertificate,
  fetchCertificateDetail,
  submitRevokeCertificate,
} from '../../features/orgIssue/orgIssueThunks';
import {
  setPage,
  setSearch,
  clearSelectedCert,
  clearIssueError,
  clearRevokeError,
} from '../../features/orgIssue/orgIssueSlice';
import {
  selectIssueCertificates,
  selectIssueTotal,
  selectIssuePage,
  selectIssueLimit,
  selectIssueSearch,
  selectIssueLoading,
  selectIssuing,
  selectIssueError2,
  selectSelectedCert,
  selectDetailLoading,
  selectDetailError,
  selectRevoking,
  selectRevokeError,
} from '../../features/orgIssue/orgIssueSelectors';
import { PRIMARY, BORDER, TEXT, MUTED, BG_SUBTLE, ERROR } from '../../styles/tokens';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const EMPTY_FORM = {
  recipient_name: '',
  recipient_email: '',
  course: '',
  description: '',
  issue_date: '',
};

function StatusBadge({ is_revoked }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      backgroundColor: is_revoked ? '#fef2f2' : '#f0fdf4',
      color: is_revoked ? '#991b1b' : '#166534',
    }}>
      {is_revoked ? 'Revoked' : 'Active'}
    </span>
  );
}

function RowActions({ row, onView, onDownload }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button
        onClick={() => onView(row.certificate_id)}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: PRIMARY,
          background: 'none',
          border: `1.5px solid ${BORDER}`,
          borderRadius: 7,
          padding: '4px 10px',
          cursor: 'pointer',
        }}
      >
        View
      </button>
      {row.file_path && !row.is_revoked && (
        <button
          onClick={() => onDownload(row.file_path, row.recipient_name)}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: TEXT,
            background: 'none',
            border: `1.5px solid ${BORDER}`,
            borderRadius: 7,
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          Download
        </button>
      )}
    </div>
  );
}

function DetailContent({ cert, loading, error, onRevoke }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
        <Loader size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', borderRadius: 10, color: '#991b1b', fontSize: 13 }}>
        {error}
      </div>
    );
  }

  if (!cert) return null;

  const verificationUrl = `${API_BASE}/api/verify/${cert.cert_hash}`;
  const fields = [
    ['Recipient',   cert.recipient_name],
    ['Course',      cert.course],
    ['Description', cert.description || '—'],
    ['Issue Date',  cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '—'],
    ['Issued By',   cert.issued_by],
    ['Issued At',   cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '—'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusBadge is_revoked={cert.is_revoked} />
        <span style={{ fontSize: 11, color: MUTED, fontFamily: 'monospace' }}>
          {cert.cert_hash?.slice(0, 16)}…
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {fields.map(([label, value]) => (
          <div key={label} style={{ backgroundColor: BG_SUBTLE, borderRadius: 10, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 4px' }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '16px 0', borderTop: `1px solid ${BORDER}` }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, margin: 0, textTransform: 'uppercase', letterSpacing: 0.8 }}>Verification QR</p>
        <QRCodeSVG value={verificationUrl} size={120} level="M" />
        <span style={{ fontSize: 11, color: MUTED, wordBreak: 'break-all', textAlign: 'center' }}>{verificationUrl}</span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {cert.file_path && !cert.is_revoked && (
          <a
            href={`${API_BASE}/${cert.file_path}`}
            download
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              borderRadius: 10,
              backgroundColor: PRIMARY,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Download PDF
          </a>
        )}
        {!cert.is_revoked && (
          <button
            onClick={() => onRevoke(cert)}
            style={{
              flex: cert.file_path ? '0 0 auto' : 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              borderRadius: 10,
              backgroundColor: '#fff',
              color: '#991b1b',
              fontWeight: 600,
              fontSize: 14,
              border: '1.5px solid #fecaca',
              cursor: 'pointer',
            }}
          >
            Revoke Certificate
          </button>
        )}
      </div>
    </div>
  );
}

export default function IssueCertificate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const toast = useToast();

  const certificates  = useSelector(selectIssueCertificates);
  const total         = useSelector(selectIssueTotal);
  const page          = useSelector(selectIssuePage);
  const limit         = useSelector(selectIssueLimit);
  const search        = useSelector(selectIssueSearch);
  const loading       = useSelector(selectIssueLoading);
  const issuing       = useSelector(selectIssuing);
  const issueError    = useSelector(selectIssueError2);
  const selectedCert  = useSelector(selectSelectedCert);
  const detailLoading = useSelector(selectDetailLoading);
  const detailError   = useSelector(selectDetailError);
  const revoking      = useSelector(selectRevoking);
  const revokeError   = useSelector(selectRevokeError);

  const [issueOpen, setIssueOpen]       = useState(false);
  const [detailOpen, setDetailOpen]     = useState(false);
  const [revokeOpen, setRevokeOpen]     = useState(false);
  const [certToRevoke, setCertToRevoke] = useState(null);
  const [revokePassword, setRevokePassword] = useState('');
  const [searchInput, setSearchInput]   = useState(search);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState({});

  useEffect(() => {
    dispatch(fetchIssueCertificates({ token, page, limit, search }));
  }, [dispatch, token, page, limit, search]);

  useEffect(() => {
    const timer = setTimeout(() => dispatch(setSearch(searchInput)), 400);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const handleOpenIssue = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    dispatch(clearIssueError());
    setIssueOpen(true);
  };

  const handleCloseIssue = () => {
    setIssueOpen(false);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    dispatch(clearSelectedCert());
  };

  const handleView = useCallback((id) => {
    dispatch(fetchCertificateDetail({ token, id }));
    setDetailOpen(true);
  }, [dispatch, token]);

  const handleOpenRevoke = useCallback((cert) => {
    setCertToRevoke(cert);
    setRevokePassword('');
    dispatch(clearRevokeError());
    setRevokeOpen(true);
  }, [dispatch]);

  const handleCloseRevoke = () => {
    setRevokeOpen(false);
    setCertToRevoke(null);
  };

  const handleConfirmRevoke = async (e) => {
    e.preventDefault();
    if (!revokePassword) return;
    const result = await dispatch(submitRevokeCertificate({
      token,
      cert_hash: certToRevoke.cert_hash,
      password: revokePassword,
    }));
    if (submitRevokeCertificate.fulfilled.match(result)) {
      toast.success('Certificate revoked successfully.');
      setRevokeOpen(false);
      setCertToRevoke(null);
    } else {
      toast.error(result.payload ?? 'Failed to revoke certificate.');
    }
  };

  const handleDownload = useCallback((filePath, recipientName) => {
    const a = document.createElement('a');
    a.href = `${API_BASE}/${filePath}`;
    a.download = `certificate-${recipientName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    a.click();
  }, []);

  const validate = () => {
    const errors = {};
    if (!form.recipient_name.trim()) errors.recipient_name = 'Required';
    if (!form.recipient_email.trim()) errors.recipient_email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipient_email)) errors.recipient_email = 'Invalid email';
    if (!form.course.trim()) errors.course = 'Required';
    if (!form.issue_date) errors.issue_date = 'Required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const result = await dispatch(submitIssueCertificate({
      token,
      data: {
        recipient_name:  form.recipient_name.trim(),
        recipient_email: form.recipient_email.trim().toLowerCase(),
        course:          form.course.trim(),
        description:     form.description.trim() || undefined,
        issue_date:      form.issue_date,
      },
    }));

    if (submitIssueCertificate.fulfilled.match(result)) {
      toast.success('Certificate issued successfully.');
      setIssueOpen(false);
      dispatch(fetchIssueCertificates({ token, page: 1, limit, search: '' }));
      dispatch(setPage(1));
      dispatch(setSearch(''));
      setSearchInput('');
    } else {
      toast.error(result.payload ?? 'Failed to issue certificate.');
    }
  };

  const isDirty = Object.values(form).some((v) => v !== '');

  const columns = [
    { key: 'recipient_name', label: 'Recipient' },
    { key: 'course', label: 'Course' },
    {
      key: 'issued_at',
      label: 'Issued',
      render: (row) => row.issued_at ? new Date(row.issued_at).toLocaleDateString() : '—',
    },
    {
      key: 'is_revoked',
      label: 'Status',
      render: (row) => <StatusBadge is_revoked={row.is_revoked} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <RowActions row={row} onView={handleView} onDownload={handleDownload} />
      ),
    },
  ];

  return (
    <OrgLayout title="Certificates" subtitle="Issue and manage signed certificates">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <input
            type="text"
            placeholder="Search recipient or course…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              border: `1.5px solid ${BORDER}`,
              borderRadius: 9,
              padding: '9px 14px',
              fontSize: 13,
              color: TEXT,
              backgroundColor: '#fff',
              outline: 'none',
              width: 280,
            }}
          />
          <Button onClick={handleOpenIssue}>Issue Certificate</Button>
        </div>

        <Table
          columns={columns}
          data={certificates}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(p) => dispatch(setPage(p))}
          loading={loading}
          emptyMessage="No certificates issued yet."
        />
      </div>

      <Modal
        isOpen={issueOpen}
        onClose={handleCloseIssue}
        title="Issue Certificate"
        size="md"
        isDirty={isDirty}
      >
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            id="recipient_name"
            label="Recipient Name"
            placeholder="Jane Doe"
            value={form.recipient_name}
            onChange={(e) => setForm((f) => ({ ...f, recipient_name: e.target.value }))}
            error={formErrors.recipient_name}
          />
          <Input
            id="recipient_email"
            label="Recipient Email"
            type="email"
            placeholder="jane@example.com"
            value={form.recipient_email}
            onChange={(e) => setForm((f) => ({ ...f, recipient_email: e.target.value }))}
            error={formErrors.recipient_email}
          />
          <Input
            id="course"
            label="Course / Award"
            placeholder="Bachelor of Computer Science"
            value={form.course}
            onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
            error={formErrors.course}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="description" style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
              Description <span style={{ fontWeight: 400, color: MUTED }}>(optional)</span>
            </label>
            <textarea
              id="description"
              placeholder="Add any additional details…"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              style={{
                padding: '10px 14px',
                fontSize: 14,
                borderRadius: 10,
                border: `1.5px solid ${BORDER}`,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                width: '100%',
              }}
            />
          </div>
          <Input
            id="issue_date"
            label="Issue Date"
            type="date"
            value={form.issue_date}
            onChange={(e) => setForm((f) => ({ ...f, issue_date: e.target.value }))}
            error={formErrors.issue_date}
          />

          {issueError && (
            <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: `1px solid #fecaca`, borderRadius: 10, fontSize: 13, color: '#991b1b' }}>
              {issueError}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button type="button" variant="outline" onClick={handleCloseIssue}>
              Cancel
            </Button>
            <Button type="submit" loading={issuing}>
              Issue Certificate
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={detailOpen}
        onClose={handleCloseDetail}
        title="Certificate Details"
        size="lg"
      >
        <DetailContent cert={selectedCert} loading={detailLoading} error={detailError} onRevoke={handleOpenRevoke} />
      </Modal>

      <Modal
        isOpen={revokeOpen}
        onClose={handleCloseRevoke}
        title="Revoke Certificate"
        size="sm"
      >
        <form onSubmit={handleConfirmRevoke} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6 }}>
            This action is <strong style={{ color: TEXT }}>permanent and irreversible</strong>. The certificate will be invalidated on the blockchain.
          </p>
          {certToRevoke && (
            <div style={{ backgroundColor: BG_SUBTLE, borderRadius: 10, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 4px' }}>Certificate</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0 }}>{certToRevoke.recipient_name} — {certToRevoke.course}</p>
            </div>
          )}
          <Input
            id="revoke_password"
            label="Confirm your password"
            type="password"
            placeholder="Enter your account password"
            value={revokePassword}
            onChange={(e) => setRevokePassword(e.target.value)}
          />
          {revokeError && (
            <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, color: '#991b1b' }}>
              {revokeError}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={handleCloseRevoke}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={revoking}
              disabled={!revokePassword}
              style={{ backgroundColor: '#dc2626', border: 'none', color: '#fff' }}
            >
              Revoke
            </Button>
          </div>
        </form>
      </Modal>
    </OrgLayout>
  );
}
