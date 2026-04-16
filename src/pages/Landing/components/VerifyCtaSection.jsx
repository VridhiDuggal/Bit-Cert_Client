import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, ArrowRight, QrCode, ShieldCheck } from 'lucide-react';

const P = '#588157';
const PL = '#eef4ee';

export function VerifyCtaSection() {
  const navigate = useNavigate();
  const [hash, setHash] = useState('');
  const [hashError, setHashError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    const t = hash.trim();
    if (!t || t.length < 10) {
      setHashError('Please enter a valid certificate hash.');
      return;
    }
    setHashError('');
    navigate(`/verify/${t}`);
  };

  return (
    <section style={{ padding: '80px 24px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'rgba(238,244,238,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(88,129,87,0.18)',
          borderRadius: 28,
          padding: '52px 48px',
          textAlign: 'center',
          boxShadow: '0 8px 48px rgba(88,129,87,0.10), 0 2px 12px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', backgroundColor: P, opacity: 0.05, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', backgroundColor: P, opacity: 0.05, pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, backgroundColor: P, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(88,129,87,0.35)' }}>
              <ShieldCheck size={24} color="#fff" />
            </div>
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Verify a Certificate Instantly
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 10px' }}>
            Scan a QR code or enter a certificate hash to verify authenticity on the blockchain. No login required.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '28px 0' }}>
            {[
              [<QrCode key="qr" size={16} />, 'Scan QR Code'],
              [<ScanLine key="scan" size={16} />, 'Enter Hash'],
              [<ShieldCheck key="chain" size={16} />, 'On-chain Result'],
            ].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: P }}>
                {icon} {label}
              </div>
            ))}
          </div>

          <form onSubmit={handleVerify} style={{ maxWidth: 520, margin: '0 auto 20px' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="text"
                value={hash}
                onChange={(e) => { setHash(e.target.value); if (hashError) setHashError(''); }}
                placeholder="Paste certificate hash…"
                onFocus={e => { e.target.style.boxShadow = `0 0 0 2.5px ${P}`; e.target.style.borderColor = 'transparent'; }}
                onBlur={e => { e.target.style.boxShadow = ''; e.target.style.borderColor = hashError ? '#ef4444' : 'rgba(88,129,87,0.25)'; }}
                style={{
                  flex: 1, minWidth: 200, padding: '13px 16px', fontSize: 14,
                  borderRadius: 12, border: `1.5px solid ${hashError ? '#ef4444' : 'rgba(88,129,87,0.25)'}`,
                  outline: 'none', backgroundColor: 'rgba(255,255,255,0.9)',
                  transition: 'box-shadow 0.15s', fontFamily: 'monospace',
                }}
              />
              <button
                type="submit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 24px',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  background: `linear-gradient(135deg, ${P} 0%, #3d6b3a 100%)`,
                  border: 'none', borderRadius: 12, cursor: 'pointer', flexShrink: 0,
                  whiteSpace: 'nowrap', boxShadow: '0 3px 12px rgba(88,129,87,0.35)',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                Verify Now <ArrowRight size={14} />
              </button>
            </div>
            {hashError && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#ef4444', textAlign: 'left' }}>{hashError}</p>
            )}
          </form>

          <button
            onClick={() => navigate('/verify')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: P, fontWeight: 600, padding: 0 }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            Open full verify page →
          </button>
        </div>
      </div>
    </section>
  );
}
