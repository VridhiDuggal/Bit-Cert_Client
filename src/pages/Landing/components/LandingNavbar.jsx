import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const P = '#588157';
const PL = '#eef4ee';

export function LandingNavbar({ onLoginOpen, onOnboardOpen, onRecipientLoginOpen }) {
  const navigate = useNavigate();
  const go = (route) => navigate(route);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: P, letterSpacing: '-0.5px' }}>Bit-Cert</span>

        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <button
            onClick={() => go('/verify')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#6b7280', padding: 0 }}
            onMouseEnter={e => (e.target.style.color = '#1a202c')}
            onMouseLeave={e => (e.target.style.color = '#6b7280')}
          >
            Verify
          </button>
        </nav>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={onRecipientLoginOpen}
            style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: `1.5px solid #94a3b8`, color: '#6b7280', background: 'transparent', cursor: 'pointer' }}
            onMouseEnter={e => (e.target.style.borderColor = P)}
            onMouseLeave={e => (e.target.style.borderColor = '#94a3b8')}
          >
            Recipient Login
          </button>
          <button
            onClick={onOnboardOpen}
            style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: `1.5px solid ${P}`, color: P, background: 'transparent', cursor: 'pointer' }}
            onMouseEnter={e => (e.target.style.backgroundColor = PL)}
            onMouseLeave={e => (e.target.style.backgroundColor = 'transparent')}
          >
            Get Started
          </button>
          <button
            onClick={onLoginOpen}
            style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: `1.5px solid ${P}`, color: P, background: 'transparent', cursor: 'pointer' }}
            onMouseEnter={e => (e.target.style.backgroundColor = PL)}
            onMouseLeave={e => (e.target.style.backgroundColor = 'transparent')}
          >
            Sign In
          </button>
          <button
            onClick={() => go('/verify')}
            style={{ fontSize: 13, fontWeight: 700, padding: '8px 18px', borderRadius: 10, border: 'none', color: '#fff', backgroundColor: P, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            onMouseEnter={e => (e.target.style.opacity = '0.88')}
            onMouseLeave={e => (e.target.style.opacity = '1')}
          >
            Verify Certificate <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
