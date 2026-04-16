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
import { selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';
import { downloadCertificate } from '../../api/recipient.api';
import * as T from '../../styles/tokens';

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

function MetaCell({ label, value, highlight, mono }) {
  return (
    <div style={{ padding: '10px 12px', backgroundColor: T.SURFACE, borderRadius: T.RADIUS.md, border: `1px solid ${T.BORDER}` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.MUTED, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: highlight ?? T.TEXT, fontFamily: mono ? 'monospace' : undefined, wordBreak: 'break-all' }}>
        {value ?? '—'}
      </div>
    </div>
  );
}

function DetailContent({ cert, history, historyLoading, toast, token, downloading, setDownloading, asModal = false }) {
  const verifyUrl = cert?.cert_hash ? `${window.location.origin}/verify/${cert.cert_hash}` : '';
  const issueDate = formatDate(cert?.issue_date);
  const expiryDate = cert?.expiry_date ? formatDate(cert.expiry_date) : null;
  const isExpired = cert?.is_expired;

  function doCopy(text, label) {
    copyToClipboard(text, () => toast.success(`${label} copied!`));
  }

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await downloadCertificate(token, cert.certificate_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${cert.cert_hash?.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Download failed.');
    } finally {
      setDownloading(false);
    }
  }

  if (asModal) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ padding: '12px 14px', backgroundColor: T.SURFACE, borderRadius: T.RADIUS.md, border: `1px solid ${T.BORDER}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.TEXT, lineHeight: 1.3, marginBottom: 3 }}>
            {cert?.course_name ?? cert?.course ?? '—'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.MUTED, marginBottom: 8 }}>
            <Building2 size={12} /> {cert?.org_name ?? '—'}
          </div>
          <Badge variant={cert?.is_revoked ? 'danger' : isExpired ? 'warning' : 'success'} size="sm">
            {cert?.is_revoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'}
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <MetaCell label="Recipient" value={cert?.recipient_name} />
          <MetaCell label="Issue Date" value={issueDate} />
          <MetaCell
            label={isExpired ? 'Expired On' : 'Expires On'}
            value={expiryDate ?? 'No expiry'}
            highlight={isExpired ? T.DANGER : undefined}
          />
          <div style={{ padding: '10px 12px', backgroundColor: T.SURFACE, borderRadius: T.RADIUS.md, border: `1px solid ${T.BORDER}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.MUTED, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Blockchain TX</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: T.TEXT_SECONDARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {cert?.blockchain_tx_id ? cert.blockchain_tx_id.slice(0, 14) + '…' : '—'}
              </span>
              {cert?.blockchain_tx_id && (
                <button onClick={() => doCopy(cert.blockchain_tx_id, 'TX ID')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.MUTED, flexShrink: 0, padding: 0 }}>
                  <Copy size={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        {cert?.cert_hash && (
          <div style={{ padding: '8px 12px', backgroundColor: T.SURFACE, borderRadius: T.RADIUS.md, border: `1px solid ${T.BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.MUTED, textTransform: 'uppercase', letterSpacing: 0.6, flexShrink: 0 }}>Hash</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: T.TEXT_SECONDARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {cert.cert_hash}
            </span>
            <button onClick={() => doCopy(cert.cert_hash, 'Hash')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.MUTED, flexShrink: 0, padding: 0 }}>
              <Copy size={10} />
            </button>
          </div>
        )}

        {cert?.is_revoked && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', backgroundColor: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: T.RADIUS.md }}>
            <AlertTriangle size={13} color={T.DANGER} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 11, color: '#991B1B' }}>Revoked by {cert?.org_name ?? 'the issuing organisation'}. Will not pass public verification.</span>
          </div>
        )}

        {!cert?.is_revoked && isExpired && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', backgroundColor: '#FFFBEB', border: `1px solid #FDE68A`, borderRadius: T.RADIUS.md }}>
            <AlertTriangle size={13} color={T.WARNING} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 11, color: '#92400E' }}>Expired on {expiryDate}. May not pass verification.</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          {cert?.file_path && (
            <button
              onClick={handleDownload}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: T.WHITE, backgroundColor: T.PRIMARY, border: 'none', borderRadius: T.RADIUS.sm, cursor: 'pointer', padding: '8px 12px' }}
            >
              {downloading ? 'Downloading…' : 'Download PDF'}
            </button>
          )}
          {cert?.cert_hash && (
            <a
              href={`/verify/${cert.cert_hash}`}
              target="_blank"
              rel="noreferrer"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: T.PRIMARY, textDecoration: 'none', border: `1px solid ${T.PRIMARY}`, borderRadius: T.RADIUS.sm, padding: '8px 12px' }}
            >
              Verify ↗
            </a>
          )}
          {verifyUrl && (
            <button
              onClick={() => doCopy(verifyUrl, 'Link')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, color: T.MUTED, background: 'none', border: `1px solid ${T.BORDER}`, borderRadius: T.RADIUS.sm, cursor: 'pointer', padding: '8px 12px' }}
            >
              <Copy size={12} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 auto', width: 'min(100%, 300px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            onClick={handleDownload}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {downloading ? 'Downloading…' : 'Download PDF'}
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

      <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ paddingBottom: 16, borderBottom: `1px solid ${T.BORDER}` }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.TEXT, marginBottom: 6, lineHeight: 1.3 }}>
            {cert?.course_name ?? cert?.course ?? '—'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: T.MUTED, marginBottom: 4 }}>
            <Building2 size={14} /> {cert?.org_name ?? '—'}
          </div>
          <div style={{ fontSize: 13, color: T.TEXT_SECONDARY, marginBottom: expiryDate ? 4 : 10 }}>
            Issued on {issueDate}
          </div>
          {expiryDate && (
            <div style={{ fontSize: 13, color: isExpired ? T.DANGER : T.TEXT_SECONDARY, marginBottom: 10 }}>
              {isExpired ? 'Expired on' : 'Expires on'} {expiryDate}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Badge variant={cert?.is_revoked ? 'danger' : isExpired ? 'warning' : 'success'} size="sm">
              {cert?.is_revoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'}
            </Badge>
          </div>
        </div>

        {cert?.is_revoked && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', backgroundColor: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: T.RADIUS.md }}>
            <AlertTriangle size={16} color={T.DANGER} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#991B1B' }}>
              This certificate has been revoked by {cert?.org_name ?? 'the issuing organisation'}. It will not pass public verification.
            </span>
          </div>
        )}

        {!cert?.is_revoked && isExpired && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', backgroundColor: '#FFFBEB', border: `1px solid #FDE68A`, borderRadius: T.RADIUS.md }}>
            <AlertTriangle size={16} color={T.WARNING} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#92400E' }}>
              This certificate expired on {expiryDate}. It may not pass verification checks.
            </span>
          </div>
        )}

        <BlockchainSection cert={cert} toast={toast} />

        <div style={{ padding: '14px 16px', border: `1px solid ${T.BORDER}`, borderRadius: T.RADIUS.md }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.TEXT, marginBottom: 10 }}>Verification History</div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 22, fontWeight: 700, color: T.PRIMARY }}>{history?.total_verifications ?? 0}</span>
              <span style={{ fontSize: 12, color: T.MUTED, marginLeft: 4 }}>total verifications</span>
            </div>
            {history?.last_verified_at && (
              <div style={{ alignSelf: 'flex-end', fontSize: 12, color: T.TEXT_SECONDARY }}>
                Last: {formatRelativeTime(history.last_verified_at)}
              </div>
            )}
          </div>
          <VerificationChart weekly_counts={history?.weekly_counts} loading={historyLoading} />
        </div>

        <div style={{ paddingTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.TEXT, marginBottom: 10 }}>Share Certificate</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {verifyUrl && <QRDownloadButton value={verifyUrl} size={110} fileName={`cert-${cert?.cert_hash?.slice(0, 8) ?? 'qr'}`} />}
            <Button
              variant="outline"
              onClick={() => doCopy(verifyUrl, 'Verification link')}
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
  const token = useSelector(selectRecipientToken);
  const [downloading, setDownloading] = useState(false);

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
        {cert && (
          <DetailContent
            cert={cert}
            history={history}
            historyLoading={historyLoading}
            toast={toast}
            token={token}
            downloading={downloading}
            setDownloading={setDownloading}
            asModal
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
          token={token}
          downloading={downloading}
          setDownloading={setDownloading}
        />
      )}
    </RecipientLayout>
  );
}
