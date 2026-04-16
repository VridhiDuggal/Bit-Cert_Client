import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldX, ShieldAlert, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import { request } from '../api/client';
import {
  PRIMARY, DANGER, BORDER, TEXT, MUTED, WHITE, SURFACE,
  SPACING, RADIUS, SHADOW,
} from '../styles/tokens';

const WARNING = '#f59e0b';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 500, color: copied ? PRIMARY : MUTED,
        padding: '3px 8px', borderRadius: RADIUS.sm,
        transition: 'color 0.15s',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: `${SPACING.sm}px 0`,
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: MUTED, width: 140, flexShrink: 0, paddingTop: 1 }}>
        {label}
      </span>
      <span style={{
        color: TEXT, wordBreak: 'break-all', flex: 1,
        fontFamily: mono ? 'monospace' : 'inherit',
        fontSize: mono ? 11 : 13,
      }}>
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function VerifyPage() {
  const { cert_hash } = useParams();
  const navigate = useNavigate();

  // 'loading' | 'valid' | 'revoked' | 'not_found' | 'error'
  const [status, setStatus]   = useState('loading');
  const [cert, setCert]       = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    setStatus('loading');
    request(`/api/verify/${encodeURIComponent(cert_hash)}`)
      .then(data => {
        setCert(data);
        if (!data.valid) {
          setStatus(data.status === 'REVOKED' ? 'revoked' : 'not_found');
        } else {
          setStatus('valid');
        }
        setTimeout(() => setVisible(true), 50);
      })
      .catch(err => {
        if (err.status === 404) setStatus('not_found');
        else setStatus('error');
        setTimeout(() => setVisible(true), 50);
      });
  }, [cert_hash]);

  const bannerConfig = {
    valid:     { bg: '#f0fdf4', border: '#86efac', icon: <ShieldCheck size={26} color={PRIMARY} strokeWidth={2.5} />, label: 'Certificate Verified', sub: 'This certificate is authentic and has been verified on the blockchain.' },
    revoked:   { bg: '#fef2f2', border: '#fca5a5', icon: <ShieldX size={26} color={DANGER} strokeWidth={2.5} />, label: 'Certificate Revoked', sub: 'This certificate has been revoked and is no longer valid.' },
    not_found: { bg: '#fffbeb', border: '#fde68a', icon: <ShieldAlert size={26} color={WARNING} strokeWidth={2.5} />, label: 'Certificate Not Found', sub: 'No certificate was found matching this hash.' },
    error:     { bg: '#fffbeb', border: '#fde68a', icon: <ShieldAlert size={26} color={WARNING} strokeWidth={2.5} />, label: 'Verification Error', sub: 'Unable to verify this certificate right now. Please try again.' },
  };

  const cfg = bannerConfig[status];
  const borderColor = status === 'valid' ? PRIMARY : status === 'revoked' ? DANGER : WARNING;

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(160deg, #eef4ee 0%, #f3f7f3 30%, #f8faf8 100%)',
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    }}>
      {/* Top bar */}
      <header style={{
        backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}`,
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: `linear-gradient(135deg, ${PRIMARY} 0%, #4a7048 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 2px 8px ${PRIMARY}40`,
          }}>
            <ShieldCheck size={16} color={WHITE} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: PRIMARY, letterSpacing: '-0.4px' }}>Bit-Cert</span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: `1px solid ${BORDER}`, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: MUTED, padding: '6px 12px',
            borderRadius: RADIUS.md, transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.backgroundColor = '#f0f5f0'; }}
          onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
        {/* Loading skeleton */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED, fontSize: 14 }}>
            Verifying certificate…
          </div>
        )}

        {/* Result */}
        {status !== 'loading' && (
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            {/* Banner */}
            <div style={{
              backgroundColor: cfg.bg,
              border: `1.5px solid ${cfg.border}`,
              borderRadius: RADIUS.lg,
              padding: `${SPACING.lg}px`,
              display: 'flex', alignItems: 'center', gap: 16,
              marginBottom: SPACING.lg,
              boxShadow: `0 4px 16px ${cfg.border}60`,
            }}>
              <div style={{
                flexShrink: 0,
                width: 48, height: 48,
                borderRadius: RADIUS.md,
                backgroundColor: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cfg.icon}</div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: TEXT, letterSpacing: '-0.2px' }}>{cfg.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: MUTED, lineHeight: 1.5 }}>{cfg.sub}</p>
              </div>
            </div>

            {/* Certificate details */}
            {cert?.certificate_id && (
              <>
                <div style={{
                  backgroundColor: WHITE, borderRadius: RADIUS.lg,
                  border: `1px solid ${BORDER}`, boxShadow: SHADOW.sm,
                  padding: `${SPACING.md}px ${SPACING.lg}px`,
                  marginBottom: SPACING.lg,
                }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: `0 0 ${SPACING.sm}px`, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Certificate Details
                  </h2>
                  <InfoRow label="Recipient Name" value={cert.recipient_name} />
                  <InfoRow label="Recipient Email" value={cert.recipient_email} />
                  <InfoRow label="Issued By" value={cert.org_name} />
                  <InfoRow label="Issue Date" value={cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
                  {cert.expiry_date && (
                    <InfoRow label="Expiry Date" value={new Date(cert.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                  )}
                  {cert.last_verified_at && (
                    <InfoRow label="Last Verified" value={new Date(cert.last_verified_at).toLocaleString()} />
                  )}
                  <InfoRow label="Status" value={
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: RADIUS.full,
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: status === 'valid' ? `${PRIMARY}18` : `${DANGER}18`,
                      color: status === 'valid' ? PRIMARY : DANGER,
                    }}>
                      {cert.status ?? 'ACTIVE'}
                    </span>
                  } />
                </div>

                {/* Blockchain section */}
                <div style={{
                  backgroundColor: WHITE, borderRadius: RADIUS.lg,
                  border: `1px solid ${BORDER}`, boxShadow: SHADOW.sm,
                  padding: `${SPACING.md}px ${SPACING.lg}px`,
                }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: `0 0 ${SPACING.sm}px`, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Blockchain Record
                  </h2>
                  <div style={{ padding: `${SPACING.sm}px 0`, borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>Certificate Hash</span>
                      <CopyButton text={cert_hash} />
                    </div>
                    <code style={{
                      display: 'block', wordBreak: 'break-all',
                      fontSize: 11, color: TEXT,
                      backgroundColor: '#f9fafb', borderRadius: RADIUS.sm,
                      padding: '8px 12px', border: `1px solid ${BORDER}`,
                    }}>
                      {cert_hash}
                    </code>
                  </div>
                  {cert.tx_id && (
                    <div style={{ padding: `${SPACING.sm}px 0` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>Transaction ID</span>
                        <CopyButton text={cert.tx_id} />
                      </div>
                      <code style={{
                        display: 'block', wordBreak: 'break-all',
                        fontSize: 11, color: TEXT,
                        backgroundColor: '#f9fafb', borderRadius: RADIUS.sm,
                        padding: '8px 12px', border: `1px solid ${BORDER}`,
                      }}>
                        {cert.tx_id}
                      </code>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
