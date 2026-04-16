import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldX, ShieldAlert, Upload, Loader2, X, ExternalLink } from 'lucide-react';
import jsQR from 'jsqr';
import { request } from '../api/client';
import { PRIMARY, BORDER, TEXT, MUTED, WHITE } from '../styles/tokens';

const DANGER  = '#ef4444';
const WARNING = '#f59e0b';

/* Pull a 64-char hex hash out of a raw QR string (URL or bare hash) */
function extractHash(raw) {
  if (!raw) return null;
  const t = raw.trim();
  if (/^[a-f0-9]{64}$/i.test(t)) return t.toLowerCase();
  const m = t.match(/\/verify\/([a-f0-9]{64})/i);
  return m ? m[1].toLowerCase() : null;
}

/* Small result banner */
function ResultBanner({ result, onClose }) {
  if (!result) return null;

  const valid   = result.valid === true;
  const revoked = result.status === 'REVOKED';

  let bg, border, iconEl, title, sub;
  if (valid) {
    bg = '#f0fdf4'; border = '#86efac';
    iconEl = <ShieldCheck size={22} color={PRIMARY} strokeWidth={2.5} />;
    title  = 'Certificate Verified';
    sub    = 'This certificate is authentic and has been verified on the blockchain.';
  } else if (revoked) {
    bg = '#fef2f2'; border = '#fca5a5';
    iconEl = <ShieldX size={22} color={DANGER} strokeWidth={2.5} />;
    title  = 'Certificate Revoked';
    sub    = 'This certificate has been revoked and is no longer valid.';
  } else {
    bg = '#fffbeb'; border = '#fde68a';
    iconEl = <ShieldAlert size={22} color={WARNING} strokeWidth={2.5} />;
    title  = 'Certificate Not Found';
    sub    = 'No certificate matching this QR code was found on the blockchain.';
  }

  return (
    <div style={{
      marginTop: 20,
      backgroundColor: bg,
      border: `1.5px solid ${border}`,
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      boxShadow: `0 4px 12px ${border}50`,
      position: 'relative',
    }}>
      <div style={{
        flexShrink: 0, width: 40, height: 40, borderRadius: 10,
        background: bg, border: `1.5px solid ${border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{iconEl}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: TEXT }}>{title}</p>
        <p style={{ margin: '3px 0 0', fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{sub}</p>

        {/* Certificate meta */}
        {result.certificate_id && (
          <div style={{
            marginTop: 10, display: 'flex', flexDirection: 'column', gap: 3,
            fontSize: 12, color: MUTED,
          }}>
            {result.recipient_name  && <span><b>Recipient:</b> {result.recipient_name}</span>}
            {result.org_name        && <span><b>Issued by:</b> {result.org_name}</span>}
            {result.course          && <span><b>Course:</b> {result.course}</span>}
            {result.issued_at       && <span><b>Issued:</b> {new Date(result.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
            {result.expiry_date     && <span><b>Expires:</b> {new Date(result.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
          </div>
        )}

        {result.cert_hash && (
          <a
            href={`/verify/${result.cert_hash}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              marginTop: 10, fontSize: 12, color: PRIMARY, fontWeight: 600, textDecoration: 'none',
            }}
          >
            <ExternalLink size={12} /> View full details
          </a>
        )}
      </div>

      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 2, flexShrink: 0 }}
        title="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function VerifyLandingPage() {
  const navigate = useNavigate();

  /* ── Hash tab ── */
  const [hash,  setHash]  = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = hash.trim();
    if (!trimmed) { setError('Please enter a certificate hash.'); return; }
    navigate(`/verify/${trimmed}`);
  }

  /* ── Upload QR tab ── */
  const fileInputRef   = useRef(null);
  const [preview,      setPreview]      = useState(null);   // data-URL of uploaded image
  const [uploadError,  setUploadError]  = useState('');
  const [verifying,    setVerifying]    = useState(false);
  const [result,       setResult]       = useState(null);   // verify API response

  async function processImage(file) {
    if (!file) return;
    setUploadError('');
    setResult(null);

    // Draw onto canvas to get pixel data for jsQR
    const dataUrl = await new Promise(res => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.readAsDataURL(file);
    });
    setPreview(dataUrl);

    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width  = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code) {
      setUploadError('No QR code detected. Try a clearer, higher-resolution image.');
      return;
    }

    const certHash = extractHash(code.data);
    if (!certHash) {
      setUploadError(`QR decoded but it doesn't contain a Bit-Cert certificate hash.`);
      return;
    }

    // Call verify API
    setVerifying(true);
    try {
      const data = await request(`/api/verify/${encodeURIComponent(certHash)}`);
      setResult({ ...data, cert_hash: certHash });
    } catch (err) {
      if (err.status === 404) {
        setResult({ valid: false, cert_hash: certHash });
      } else {
        setUploadError('Verification failed. Please try again.');
      }
    } finally {
      setVerifying(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) processImage(file);
    e.target.value = '';
  }

  function resetUpload() {
    setPreview(null);
    setUploadError('');
    setResult(null);
  }

  /* ── Tab state ── */
  const [tab, setTab] = useState('hash');
  const TABS = [
    { id: 'hash',   label: 'Enter Hash' },
    { id: 'upload', label: 'Upload QR'  },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #eef4ee 0%, #f3f7f3 30%, #f8faf8 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        backgroundColor: WHITE, borderRadius: 20, border: `1px solid ${BORDER}`,
        padding: '40px 40px 36px', width: '100%', maxWidth: 480,
        boxShadow: '0 8px 32px rgba(88,129,87,0.10), 0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: `linear-gradient(135deg, ${PRIMARY} 0%, #4a7048 100%)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, boxShadow: `0 4px 14px ${PRIMARY}40`,
          }}>
            <ShieldCheck size={28} color={WHITE} strokeWidth={2} />
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: '-0.4px' }}>
            Verify Certificate
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: MUTED, lineHeight: 1.6 }}>
            Check any Bit-Cert certificate against the blockchain.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          backgroundColor: '#f5f7f5', borderRadius: 10,
          padding: 4, border: `1px solid ${BORDER}`,
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(''); setUploadError(''); setResult(null); }}
              style={{
                flex: 1, padding: '8px 4px', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
                borderRadius: 7, border: 'none', cursor: 'pointer',
                background: tab === t.id ? WHITE : 'transparent',
                color: tab === t.id ? TEXT : MUTED,
                boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 150ms',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Enter Hash ── */}
        {tab === 'hash' && (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="cert-hash" style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
                Certificate Hash
              </label>
              <input
                id="cert-hash"
                type="text"
                value={hash}
                onChange={e => { setHash(e.target.value); setError(''); }}
                placeholder="Paste the certificate hash here"
                autoFocus
                style={{
                  padding: '11px 14px', fontSize: 13, borderRadius: 10,
                  border: `1.5px solid ${error ? DANGER : BORDER}`,
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                  fontFamily: 'monospace', transition: 'border-color 0.15s',
                }}
                onFocus={e => { e.target.style.borderColor = error ? DANGER : PRIMARY; }}
                onBlur={e  => { e.target.style.borderColor = error ? DANGER : BORDER; }}
              />
              {error && <span style={{ fontSize: 12, color: DANGER }}>{error}</span>}
            </div>
            <button
              type="submit"
              style={{
                padding: '12px 0', borderRadius: 10,
                background: `linear-gradient(135deg, ${PRIMARY} 0%, #4a7048 100%)`,
                color: WHITE, fontWeight: 700, fontSize: 15, border: 'none',
                cursor: 'pointer', width: '100%', boxShadow: `0 4px 14px ${PRIMARY}40`,
                transition: 'opacity 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Verify Certificate
            </button>
          </form>
        )}

        {/* ── Upload QR ── */}
        {tab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Drop zone */}
            <div
              onClick={() => !verifying && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${uploadError ? DANGER : BORDER}`,
                borderRadius: 12, padding: preview ? '12px' : '32px 16px',
                textAlign: 'center', cursor: verifying ? 'default' : 'pointer',
                backgroundColor: '#f9fafb', transition: 'border-color 0.15s, background 0.15s',
                minHeight: 120, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!verifying) { e.currentTarget.style.borderColor = PRIMARY; e.currentTarget.style.background = '#f0f5f0'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = uploadError ? DANGER : BORDER; e.currentTarget.style.background = '#f9fafb'; }}
            >
              {verifying ? (
                <>
                  <Loader2 size={28} color={PRIMARY} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: 13, color: MUTED }}>Verifying certificate…</span>
                </>
              ) : preview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <img src={preview} alt="QR preview" style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
                  <span style={{ fontSize: 12, color: MUTED }}>Click to upload a different image</span>
                </div>
              ) : (
                <>
                  <Upload size={28} color={MUTED} />
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: TEXT }}>Click to upload QR image</p>
                  <p style={{ margin: 0, fontSize: 12, color: MUTED }}>PNG, JPG or WEBP — the QR from your certificate</p>
                </>
              )}
            </div>

            {/* Upload error */}
            {uploadError && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '10px 12px', backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA', borderRadius: 8,
                fontSize: 13, color: '#991B1B',
              }}>
                <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                {uploadError}
              </div>
            )}

            {/* Result banner */}
            <ResultBanner result={result} onClose={resetUpload} />

            {/* Upload button (when no result yet / no preview) */}
            {!result && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={verifying}
                style={{
                  padding: '12px 0', borderRadius: 10,
                  background: verifying ? '#9ca3af' : `linear-gradient(135deg, ${PRIMARY} 0%, #4a7048 100%)`,
                  color: WHITE, fontWeight: 700, fontSize: 15, border: 'none',
                  cursor: verifying ? 'not-allowed' : 'pointer',
                  width: '100%', boxShadow: verifying ? 'none' : `0 4px 14px ${PRIMARY}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { if (!verifying) { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Upload size={15} />
                {verifying ? 'Verifying…' : 'Choose QR Image'}
              </button>
            )}

            {/* Try another after result */}
            {result && (
              <button
                onClick={resetUpload}
                style={{
                  padding: '12px 0', borderRadius: 10, border: `1.5px solid ${BORDER}`,
                  background: WHITE, color: TEXT, fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', width: '100%', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f5f0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = WHITE; }}
              >
                Verify another QR
              </button>
            )}
          </div>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
