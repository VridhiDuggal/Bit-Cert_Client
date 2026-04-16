import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { Clipboard, Camera, ShieldCheck, ShieldX, AlertTriangle, Copy, Check, ExternalLink, RotateCcw } from 'lucide-react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PageTransition } from '../../components/shared/PageTransition';
import { selectToken, selectOrg } from '../../store/auth/authSelectors';
import {
  PRIMARY, BORDER, TEXT, MUTED, SURFACE, WHITE, BG_SUBTLE,
  DANGER, SUCCESS, WARNING, INFO, SPACING, RADIUS, SHADOW, DURATION, TEXT_SECONDARY,
} from '../../styles/tokens';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function AnimatedCheck() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <style>{`@keyframes drawCheck { to { stroke-dashoffset: 0; } }`}</style>
      <circle cx="32" cy="32" r="30" stroke={PRIMARY} strokeWidth="3" fill={`${PRIMARY}15`} />
      <polyline
        points="18,33 28,43 46,24"
        stroke={PRIMARY}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="40"
        strokeDashoffset="40"
        style={{ animation: 'drawCheck 600ms ease forwards 100ms' }}
      />
    </svg>
  );
}

function AnimatedX() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <style>{`@keyframes drawX1 { to { stroke-dashoffset: 0; } }`}</style>
      <circle cx="32" cy="32" r="30" stroke={DANGER} strokeWidth="3" fill={`${DANGER}15`} />
      <line
        x1="20" y1="20" x2="44" y2="44"
        stroke={DANGER} strokeWidth="4" strokeLinecap="round"
        strokeDasharray="34" strokeDashoffset="34"
        style={{ animation: 'drawX1 400ms ease forwards 100ms' }}
      />
      <line
        x1="44" y1="20" x2="20" y2="44"
        stroke={DANGER} strokeWidth="4" strokeLinecap="round"
        strokeDasharray="34" strokeDashoffset="34"
        style={{ animation: 'drawX1 400ms ease forwards 300ms' }}
      />
    </svg>
  );
}

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isExpired(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function OrgVerify() {
  const navigate    = useNavigate();
  const token       = useSelector(selectToken);
  const org         = useSelector(selectOrg);
  const fileInputRef = useRef(null);

  const [input,     setInput]     = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState(null);
  const [copied,    setCopied]    = useState(false);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text.trim());
    } catch {
      setError('Clipboard access denied. Please paste manually.');
    }
  }

  function handleQRFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = jsQR(imageData.data, imageData.width, imageData.height);
        if (!decoded) { setError('Could not read QR code from image. Try a cleaner image.'); return; }
        try {
          const parsed = JSON.parse(decoded.data);
          if (parsed.cert_hash) { setInput(parsed.cert_hash); setError(null); return; }
        } catch {}
        setInput(decoded.data.trim());
        setError(null);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  async function handleVerify() {
    const hash = input.trim();
    if (!hash) { setError('Please enter a certificate hash.'); return; }
    setVerifying(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/verify/${encodeURIComponent(hash)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Verification request failed.');
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err.message ?? 'Network error. Check your connection.');
    } finally {
      setVerifying(false);
    }
  }

  function handleReset() {
    setInput('');
    setResult(null);
    setError(null);
  }

  function copyTx(tx) {
    navigator.clipboard.writeText(tx).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const certBelongsToOrg = result?.valid && result?.issuer?.msp_id && org &&
    result.issuer.org_name === org.org_name;

  return (
    <OrgLayout>
      <PageTransition>
        <PageHeader title="Verify Certificate" subtitle="Check the authenticity of any certificate" />

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* Input card */}
          {!result && (
            <div style={{
              backgroundColor: WHITE, borderRadius: RADIUS.lg, border: `1px solid ${BORDER}`,
              padding: SPACING.xl, boxShadow: SHADOW.md, marginBottom: SPACING.lg,
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: `0 0 ${SPACING.md}px` }}>
                Enter Certificate Hash
              </p>

              <div style={{ position: 'relative', marginBottom: SPACING.sm }}>
                <input
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(null); }}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  placeholder="SHA-256 certificate hash…"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px 48px 12px 14px',
                    fontSize: 13, fontFamily: 'monospace',
                    border: `1.5px solid ${error ? DANGER : BORDER}`,
                    borderRadius: RADIUS.md, outline: 'none', color: TEXT,
                    backgroundColor: WHITE,
                  }}
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4,
                  }}
                >
                  <Clipboard size={16} />
                </button>
              </div>

              {error && (
                <p style={{ fontSize: 12, color: DANGER, margin: `0 0 ${SPACING.sm}px` }}>{error}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, margin: `${SPACING.md}px 0` }}>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
                <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
              </div>

              <div style={{ marginBottom: SPACING.lg }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleQRFile}
                />
                <Button
                  variant="outline"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={15} /> Upload QR Code Image
                </Button>
              </div>

              <Button
                style={{ width: '100%', justifyContent: 'center' }}
                loading={verifying}
                onClick={handleVerify}
              >
                <ShieldCheck size={15} />
                {verifying ? 'Verifying…' : 'Verify Certificate'}
              </Button>
            </div>
          )}

          {/* Result — valid */}
          {result?.valid && (
            <div
              style={{
                backgroundColor: WHITE, borderRadius: RADIUS.lg,
                border: `1.5px solid ${PRIMARY}44`, padding: SPACING.xl,
                boxShadow: SHADOW.md,
                animation: 'slideIn 300ms ease',
              }}
            >
              <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: SPACING.lg }}>
                <AnimatedCheck />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY, margin: `${SPACING.sm}px 0 0` }}>
                  Certificate Verified
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  ['Issued To',          result.recipient_name ?? '—'],
                  ['Course / Achievement', result.course ?? '—'],
                  ['Issued By',          result.issuer?.org_name ?? result.issuer?.msp_id ?? '—'],
                  ['Issue Date',         formatDate(result.issued_at)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: SPACING.md, padding: `${SPACING.sm}px 0`, borderBottom: `1px solid ${BORDER}` }}>
                    <span style={{ fontSize: 13, color: MUTED, minWidth: 160, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{value}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: SPACING.md, padding: `${SPACING.sm}px 0`, borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 13, color: MUTED, minWidth: 160, flexShrink: 0 }}>Expiry</span>
                  <span style={{ fontSize: 13 }}>
                    {result.expiry_date ? (
                      isExpired(result.expiry_date)
                        ? <Badge variant="danger" size="sm">Expired {formatDate(result.expiry_date)}</Badge>
                        : <span style={{ color: TEXT_SECONDARY }}>{formatDate(result.expiry_date)}</span>
                    ) : <span style={{ color: MUTED }}>No expiry</span>}
                  </span>
                </div>

                {result.blockchain_tx_id && (
                  <div style={{ display: 'flex', gap: SPACING.md, padding: `${SPACING.sm}px 0`, borderBottom: `1px solid ${BORDER}`, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: MUTED, minWidth: 160, flexShrink: 0 }}>Blockchain TX</span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: TEXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {result.blockchain_tx_id.slice(0, 28)}…
                    </span>
                    <button
                      onClick={() => copyTx(result.blockchain_tx_id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, flexShrink: 0 }}
                    >
                      {copied ? <Check size={14} color={PRIMARY} /> : <Copy size={14} />}
                    </button>
                  </div>
                )}

                {typeof result.verification_count === 'number' && (
                  <div style={{ display: 'flex', gap: SPACING.md, padding: `${SPACING.sm}px 0` }}>
                    <span style={{ fontSize: 13, color: MUTED, minWidth: 160, flexShrink: 0 }}>Verified</span>
                    <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>
                      {result.verification_count} time{result.verification_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: SPACING.sm, marginTop: SPACING.lg, flexWrap: 'wrap' }}>
                {certBelongsToOrg && result.certificate_id && (
                  <Button
                    variant="outline"
                    style={{ fontSize: 13 }}
                    onClick={() => navigate(`/org/certificate/${result.certificate_id}`)}
                  >
                    <ExternalLink size={14} /> View in Dashboard
                  </Button>
                )}
                <Button variant="ghost" style={{ fontSize: 13 }} onClick={handleReset}>
                  <RotateCcw size={14} /> Verify Another
                </Button>
              </div>
            </div>
          )}

          {/* Result — invalid */}
          {result && !result.valid && (
            <div
              style={{
                backgroundColor: WHITE, borderRadius: RADIUS.lg,
                border: `1.5px solid ${DANGER}44`, padding: SPACING.xl,
                boxShadow: SHADOW.md,
                animation: 'slideIn 300ms ease',
              }}
            >
              <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: SPACING.lg }}>
                <AnimatedX />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: DANGER, margin: `${SPACING.sm}px 0 0` }}>
                  Verification Failed
                </h2>
              </div>

              <p style={{ fontSize: 14, color: TEXT_SECONDARY, textAlign: 'center', marginBottom: SPACING.md }}>
                {result.reason?.toLowerCase().includes('revoked')
                  ? 'This certificate was revoked by the issuing organisation.'
                  : result.reason?.toLowerCase().includes('not found')
                  ? 'No certificate found with this hash.'
                  : result.reason ?? 'Verification failed.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="ghost" style={{ fontSize: 13 }} onClick={handleReset}>
                  <RotateCcw size={14} /> Verify Another
                </Button>
              </div>
            </div>
          )}

          {/* Error state (network/server) */}
          {!result && error && input.trim() && !verifying && (
            null
          )}
        </div>
      </PageTransition>
    </OrgLayout>
  );
}
