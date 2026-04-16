import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';

const P = '#588157';
const PL = '#eef4ee';

export function LandingNavbar({ onLoginOpen, onOnboardOpen, onRecipientLoginOpen }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px 0', pointerEvents: 'none' }}>
      <header style={{
        maxWidth: 1200,
        margin: '0 auto',
        pointerEvents: 'all',
        backgroundColor: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderRadius: 20,
        border: '1px solid rgba(200,220,200,0.55)',
        boxShadow: '0 4px 32px rgba(88,129,87,0.10), 0 1.5px 6px rgba(0,0,0,0.06)',
        padding: '0 20px',
        height: 62,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            backgroundColor: P,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <ShieldCheck size={19} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1a202c', letterSpacing: '-0.4px' }}>
            Bit<span style={{ color: P }}>-Cert</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={onRecipientLoginOpen}
            style={{
              fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 10,
              border: '1.5px solid #d1d5db', color: '#6b7280',
              background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280'; }}
          >
            Recipient Login
          </button>
          <button
            onClick={onLoginOpen}
            style={{
              fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 10,
              border: '1.5px solid #d1d5db', color: '#6b7280',
              background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280'; }}
          >
            Org Login
          </button>
          <button
            onClick={onOnboardOpen}
            style={{
              fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 10,
              border: `1.5px solid ${P}`, color: P,
              background: PL, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = P; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = PL; e.currentTarget.style.color = P; }}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/verify')}
            style={{
              fontSize: 13, fontWeight: 700, padding: '7px 18px', borderRadius: 10,
              border: 'none', color: '#fff',
              background: `linear-gradient(135deg, ${P} 0%, #3d6b3a 100%)`,
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(88,129,87,0.32)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Verify Certificate
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{
          maxWidth: 1200, margin: '6px auto 0', pointerEvents: 'all',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          borderRadius: 16, border: '1px solid rgba(200,220,200,0.55)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          padding: '12px 20px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {[
            ['Recipient Login', onRecipientLoginOpen],
            ['Org Login', onLoginOpen],
            ['Get Started', onOnboardOpen],
            ['Verify Certificate', () => navigate('/verify')],
          ].map(([label, action]) => (
            <button key={label} onClick={() => { action(); setMenuOpen(false); }} style={{
              textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: '#374151', padding: '8px 0',
              borderBottom: '1px solid #f3f4f6',
            }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
