import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, ArrowRight } from 'lucide-react';

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

  const focusStyle = (e) => {
    e.target.style.outline = 'none';
    e.target.style.boxShadow = `0 0 0 2px ${P}`;
    e.target.style.borderColor = 'transparent';
  };

  const blurStyle = (e) => {
    e.target.style.boxShadow = '';
    e.target.style.borderColor = hashError ? '#ef4444' : '#e5e7eb';
  };

  return (
    <section style={{ backgroundColor: '#fff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, backgroundColor: PL, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ScanLine size={26} style={{ color: P }} />
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '0 0 10px' }}>Verify a Certificate Now</h2>
        <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 32px' }}>
          Paste any certificate hash below to verify its authenticity on-chain instantly. No account or login required.
        </p>

        <form onSubmit={handleVerify} style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={hash}
              onChange={(e) => { setHash(e.target.value); if (hashError) setHashError(''); }}
              placeholder="Paste certificate hash..."
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={{ flex: 1, minWidth: 200, padding: '13px 16px', fontSize: 14, borderRadius: 12, border: `1.5px solid ${hashError ? '#ef4444' : '#e5e7eb'}`, outline: 'none', transition: 'box-shadow 0.15s' }}
            />
            <button
              type="submit"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 22px', fontSize: 13, fontWeight: 700, color: '#fff', backgroundColor: P, border: 'none', borderRadius: 12, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Verify Now <ArrowRight size={14} />
            </button>
          </div>
          {hashError && (
            <p style={{ marginTop: 8, fontSize: 13, color: '#ef4444', textAlign: 'left' }}>{hashError}</p>
          )}
        </form>
      </div>
    </section>
  );
}
