import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { PageTransition } from '../../components/shared/PageTransition';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { VerificationChart } from '../../components/ui/VerificationChart';
import { selectToken } from '../../store/auth/authSelectors';
import { fetchCertificateDetail } from '../../features/orgIssue/orgIssueThunks';
import { clearSelectedCert } from '../../features/orgIssue/orgIssueSlice';
import {
  selectSelectedCert,
  selectDetailLoading,
  selectDetailError,
} from '../../features/orgIssue/orgIssueSelectors';
import { BORDER, TEXT, MUTED, BG_SUBTLE, PRIMARY } from '../../styles/tokens';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function StatusBadge({ is_revoked }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      backgroundColor: is_revoked ? '#fef2f2' : '#f0fdf4',
      color: is_revoked ? '#991b1b' : '#166534',
    }}>
      {is_revoked ? 'Revoked' : 'Active'}
    </span>
  );
}

export default function CertificateDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const cert = useSelector(selectSelectedCert);
  const loading = useSelector(selectDetailLoading);
  const error = useSelector(selectDetailError);

  useEffect(() => {
    dispatch(fetchCertificateDetail({ token, id }));
    return () => { dispatch(clearSelectedCert()); };
  }, [dispatch, token, id]);

  const verificationUrl = cert ? `${API_BASE}/api/verify/${cert.cert_hash}` : '';

  const fields = cert
    ? [
        ['Recipient',   cert.recipient_name],
        ['Course',      cert.course],
        ['Description', cert.description || '—'],
        ['Issue Date',  cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '—'],
        ['Issued By',   cert.issued_by],
        ['Issued At',   cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '—'],
        ['Blockchain TX', cert.blockchain_tx_id || '—'],
      ]
    : [];

  return (
    <OrgLayout title="Certificate Details" subtitle="Full certificate information">
      <PageTransition>
      <div style={{ maxWidth: 720 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ fontSize: 13, color: PRIMARY, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 20 }}
        >
          ← Back
        </button>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Loader size="md" />
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '14px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, fontSize: 14, color: '#991b1b' }}>
            {error}
          </div>
        )}

        {cert && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <StatusBadge is_revoked={cert.is_revoked} />
                <span style={{ fontSize: 11, color: MUTED, fontFamily: 'monospace' }}>
                  {cert.cert_hash?.slice(0, 24)}…
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {fields.map(([label, value]) => (
                  <div
                    key={label}
                    style={{ backgroundColor: BG_SUBTLE, borderRadius: 10, padding: '12px 16px', border: `1px solid ${BORDER}` }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 5px' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, margin: 0, wordBreak: 'break-all' }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 28,
              border: `1px solid ${BORDER}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, margin: 0 }}>
                Verification QR Code
              </p>
              <QRCodeSVG value={verificationUrl} size={140} level="M" />
              <span style={{ fontSize: 12, color: MUTED, wordBreak: 'break-all', textAlign: 'center', maxWidth: 400 }}>
                {verificationUrl}
              </span>
            </div>

            {cert.file_path && !cert.is_revoked && (
              <a
                href={`${API_BASE}/${cert.file_path}`}
                download
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '11px 24px',
                  borderRadius: 10,
                  backgroundColor: PRIMARY,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                }}
              >
                Download PDF
              </a>
            )}

            {cert.verification_history && (
              <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Verification Activity</div>
                <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 700, color: PRIMARY }}>
                      {cert.verification_history.total_verifications ?? 0}
                    </span>
                    <span style={{ fontSize: 12, color: MUTED, marginLeft: 4 }}>total verifications</span>
                  </div>
                  <div style={{ alignSelf: 'flex-end', fontSize: 12, color: MUTED }}>
                    Last verified:{' '}
                    {cert.verification_history.last_verified_at
                      ? new Date(cert.verification_history.last_verified_at).toLocaleDateString()
                      : 'Never'}
                  </div>
                </div>
                <VerificationChart weekly_counts={cert.verification_history.weekly_counts} loading={false} />
              </div>
            )}
          </div>
        )}
      </div>
      </PageTransition>
    </OrgLayout>
  );
}
