import {
  ShieldCheck,
  FileText,
  Network,
  QrCode,
  ScanLine,
  BadgeCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

const P = '#588157';
const PL = '#eef4ee';

export function HeroSection({ onLoginOpen, onOnboardOpen }) {
  return (
    <section style={{ backgroundColor: '#fff', padding: '80px 24px 96px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', backgroundColor: P, opacity: 0.04, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -60, width: 280, height: 280, borderRadius: '50%', backgroundColor: P, opacity: 0.04, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: PL, color: P, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 14px', borderRadius: 20, width: 'fit-content' }}>
            <ShieldCheck size={12} /> Blockchain-Backed Credentials
          </span>

          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, color: '#1a202c', margin: 0 }}>
            Trust Certificates.{' '}
            <span style={{ color: P }}>Instantly Verify.</span>{' '}
            No Middleman.
          </h1>

          <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
            Bit-Cert uses Hyperledger Fabric blockchain and ECDSA cryptographic signatures to
            eliminate fake credentials and enable public, trustless verification — no login required.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <button
              onClick={onOnboardOpen}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: 'none', backgroundColor: P, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(88,129,87,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Get Started as Organisation <ArrowRight size={16} />
            </button>
            <button
              onClick={onLoginOpen}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: `2px solid ${P}`, backgroundColor: 'transparent', color: P, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = PL)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Organisation Login
            </button>
          </div>

          <div style={{ display: 'flex', gap: 36, marginTop: 8 }}>
            {[['10,000+', 'Certificates Issued'], ['50+', 'Organisations'], ['120K+', 'Verifications']].map(([val, label]) => (
              <div key={label}>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#1a202c', margin: 0 }}>{val}</p>
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 420, backgroundColor: PL, borderRadius: 28, padding: 28, boxShadow: '0 24px 64px rgba(88,129,87,0.14)', border: '1px solid #ddeedd', position: 'relative' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>Certificate</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: P, backgroundColor: PL, padding: '3px 10px', borderRadius: 12 }}>✓ Valid</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a202c', margin: '0 0 4px' }}>Bachelor of Technology</p>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px' }}>Vriddhi Duggal · VIT University</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, backgroundColor: PL, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={13} style={{ color: P }} />
                </div>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#9ca3af' }}>0x3f8a…d921c4b</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                [<ShieldCheck key="ecdsa" size={18} />, 'ECDSA'],
                [<Network key="fabric" size={18} />, 'Fabric'],
                [<QrCode key="qr" size={18} />, 'QR Verify'],
              ].map(([icon, label]) => (
                <div key={label} style={{ backgroundColor: '#fff', borderRadius: 14, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ color: P }}>{icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#6b7280' }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 36, height: 36, backgroundColor: PL, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ScanLine size={18} style={{ color: P }} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1a202c', margin: 0 }}>Blockchain Verified</p>
                <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>Hyperledger Fabric · Block #14,823</p>
              </div>
              <BadgeCheck size={18} style={{ color: P, marginLeft: 'auto', flexShrink: 0 }} />
            </div>

            <div style={{ position: 'absolute', bottom: -16, right: -16, width: 56, height: 56, backgroundColor: P, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(88,129,87,0.4)' }}>
              <Lock size={24} style={{ color: '#fff' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
