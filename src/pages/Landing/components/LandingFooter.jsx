import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function LandingFooter() {
  const navigate = useNavigate();
  const go = (route) => navigate(route);

  return (
    <footer style={{ backgroundColor: '#111827', color: '#fff', padding: '60px 24px 28px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#7dba72', margin: '0 0 14px' }}>Bit-Cert</p>
            <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7, maxWidth: 340, margin: '0 0 16px' }}>
              A trustless blockchain certificate issuance and verification platform powered by Hyperledger Fabric. Eliminate fake credentials with cryptographic proof.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#7dba72' }} />
              <span style={{ fontSize: 11, color: '#6b7280' }}>Blockchain network active</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#6b7280', margin: '0 0 14px' }}>Platform</p>
            {[['Verify Certificate', '/verify'], ['Organisation Login', '/org/login'], ['Recipient Login', '/recipient/login'], ['Sign In', '/login']].map(([label, route]) => (
              <button
                key={label}
                onClick={() => go(route)}
                style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#9ca3af', padding: '4px 0', textAlign: 'left', width: '100%' }}
                onMouseEnter={e => (e.target.style.color = '#fff')}
                onMouseLeave={e => (e.target.style.color = '#9ca3af')}
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#6b7280', margin: '0 0 14px' }}>Technology</p>
            {['Hyperledger Fabric', 'ECDSA Signatures', 'SHA-256 Hashing', 'Blockchain MSP', 'QR Verification'].map((item) => (
              <p key={item} style={{ fontSize: 13, color: '#9ca3af', margin: '4px 0' }}>{item}</p>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1f2937', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>© 2026 Bit-Cert · Blockchain Certificate Verification Platform</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={13} style={{ color: '#7dba72' }} />
            <span style={{ fontSize: 12, color: '#6b7280' }}>Cryptographically secured · Decentralised trust</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
