import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, ChevronDown, ChevronUp, Copy, AlertTriangle, ArrowLeft } from 'lucide-react';
import { RecipientLayout } from '../../components/recipient/RecipientLayout';
import { CertificatePreview } from '../../components/ui/CertificatePreview';
import { QRDownloadButton } from '../../components/ui/QRDownloadButton';
import { VerificationChart } from '../../components/ui/VerificationChart';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';
import { copyToClipboard } from '../../utils/clipboard';
import {
  fetchCertificateDetail,
  fetchVerificationHistory,
} from '../../features/recipientCertificates/recipientCertificatesThunks';
import {
  selectSelectedCert,
  selectSelectedCertLoading,
  selectSelectedCertError,
  selectVerificationHistory,
  selectVerificationHistoryLoading,
} from '../../features/recipientCertificates/recipientCertificatesSelectors';
import { useToast } from '../../hooks/useToast';
import * as T from '../../styles/tokens';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function BlockchainSection({ cert, toast }) {
  const [open, setOpen] = useState(false);

  function copy(text) {
    copyToClipboard(text, toast.success);
  }

  return (
    <div style={{ border: `1px solid ${T.BORDER}`, borderRadius: T.RADIUS.md, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: T.SURFACE,
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: T.TEXT,
        }}
      >
        Blockchain Verification
        {open ? <ChevronUp size={16} color={T.MUTED} /> : <ChevronDown size={16} color={T.MUTED} />}
      </button>
      {open && (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cert.cert_hash && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                Certificate Hash
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: T.TEXT_SECONDARY, wordBreak: 'break-all', flex: 1 }}>
                  {cert.cert_hash}
                </span>
                <button onClick={() => copy(cert.cert_hash)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.MUTED, flexShrink: 0 }}>
                  <Copy size={14} />
                </button>
              </div>
            </div>
          )}
          {cert.blockchain_tx_id && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                Transaction ID
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: T.TEXT_SECONDARY, wordBreak: 'break-all', flex: 1 }}>
                  {cert.blockchain_tx_id}
                </span>
                <button onClick={() => copy(cert.blockchain_tx_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.MUTED, flexShrink: 0 }}>
                  <Copy size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailContent({ cert, history, historyLoading, toast }) {
  const verifyUrl = cert?.cert_hash ? `${window.location.origin}/verify/${cert.cert_hash}` : '';
  const issueDate = formatDate(cert?.issue_date);

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: '0 0 auto', width: 'min(100%, 320px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CertificatePreview
          orgName={cert?.org_name}
          recipientName={cert?.recipient_name}
          course={cert?.course_name ?? cert?.course}
          issueDate={cert?.issue_date}
          isRevoked={cert?.is_revoked}
        />
        {cert?.file_path && (
          <Button
            variant="primary"
            onClick={() => window.open(`${API_BASE}/${cert.file_path}`, '_blank')}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Download PDF
          </Button>
        )}
        {cert?.cert_hash && (
          <a
            href={`/verify/${cert.cert_hash}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, color: T.PRIMARY, textAlign: 'center', textDecoration: 'none' }}
          >
            Open in new tab ↗
          </a>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, color: T.TEXT, marginBottom: 8 }}>
            {cert?.course_name ?? cert?.course ?? '—'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: T.MUTED, marginBottom: 4 }}>
            <Building2 size={14} /> {cert?.org_name ?? '—'}
          </div>
          <div style={{ fontSize: 13, color: T.TEXT_MUTED, marginBottom: 8 }}>
            Issued on {issueDate}
          </div>
          <Badge variant={cert?.is_revoked ? 'danger' : 'success'} size="sm">
            {cert?.is_revoked ? 'Revoked' : 'Active'}
          </Badge>
        </div>

        {cert?.is_revoked && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', backgroundColor: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: T.RADIUS.md }}>
            <AlertTriangle size={16} color={T.DANGER} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#991B1B' }}>
              This certificate has been revoked by {cert?.org_name ?? 'the issuing organisation'}. It will not pass public verification.
            </span>
          </div>
        )}

        <BlockchainSection cert={cert} toast={toast} />

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.TEXT, marginBottom: 8 }}>Verification History</div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 700, color: T.PRIMARY }}>{history?.total_verifications ?? 0}</span>
              <span style={{ fontSize: 12, color: T.MUTED, marginLeft: 4 }}>verifications</span>
            </div>
            <div style={{ alignSelf: 'flex-end', fontSize: 12, color: T.TEXT_MUTED }}>
              Last verified: {formatRelativeTime(history?.last_verified_at)}
            </div>
          </div>
          <VerificationChart weekly_counts={history?.weekly_counts} loading={historyLoading} />
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.TEXT, marginBottom: 10 }}>Share</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            {verifyUrl && <QRDownloadButton value={verifyUrl} size={120} fileName={`cert-${cert?.cert_hash?.slice(0, 8) ?? 'qr'}`} />}
            <Button
              variant="outline"
              onClick={() => copyToClipboard(verifyUrl, () => toast.success('Verification link copied!'))}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '7px 14px' }}
            >
              <Copy size={13} /> Copy Verification Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipientCertificateDetail({ certificateId: propId, asModal = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const toast = useToast();
  const certId = propId ?? paramId;

  const cert = useSelector(selectSelectedCert);
  const loading = useSelector(selectSelectedCertLoading);
  const error = useSelector(selectSelectedCertError);
  const history = useSelector(selectVerificationHistory);
  const historyLoading = useSelector(selectVerificationHistoryLoading);

  useEffect(() => {
    if (certId) {
      dispatch(fetchCertificateDetail(certId));
      dispatch(fetchVerificationHistory(certId));
    }
  }, [dispatch, certId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 64 }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: T.DANGER, fontSize: 14 }}>
        {error}
      </div>
    );
  }

  if (asModal) {
    return (
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.TEXT, marginBottom: 20 }}>
          Certificate Details
        </div>
        {cert && (
          <DetailContent
            cert={cert}
            history={history}
            historyLoading={historyLoading}
            toast={toast}
          />
        )}
      </div>
    );
  }

  return (
    <RecipientLayout title="Certificate Detail">
      <div style={{ marginBottom: T.SPACING.lg }}>
        <button
          onClick={() => navigate('/recipient/certificates')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft size={14} /> Back to Certificates
        </button>
      </div>
      {cert && (
        <DetailContent
          cert={cert}
          history={history}
          historyLoading={historyLoading}
          toast={toast}
        />
      )}
    </RecipientLayout>
  );
}
