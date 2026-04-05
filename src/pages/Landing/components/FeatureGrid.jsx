import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Database,
  ScanLine,
  Building2,
  UserCheck,
  Globe,
  Key,
  Hash,
  Network,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  QrCode,
  Zap,
  Lock,
} from 'lucide-react';

const P = '#588157';
const PL = '#eef4ee';
const PM = '#c8dfc8';

const roles = [
  {
    icon: <Building2 size={26} />,
    title: 'Organisation',
    badge: 'Invite-only',
    desc: 'Issue blockchain-signed certificates at scale. Manage recipients, track verifications, and revoke credentials when needed.',
    points: ['Issue & sign certificates on-chain', 'Invite recipients by email', 'View verification activity', 'Revoke or reissue credentials'],
    cta: 'Organisation Login',
    route: '/org/login',
    primary: true,
  },
  {
    icon: <UserCheck size={26} />,
    title: 'Recipient',
    badge: 'Invite required',
    desc: 'Access your issued certificates, download PDFs, and share a unique QR code for instant third-party verification.',
    points: ['View all your certificates', 'Share QR verification links', 'Download credential PDFs', 'Decentralised identity (DID)'],
    cta: 'Recipient Login',
    route: '/recipient/login',
    primary: false,
  },
  {
    icon: <Globe size={26} />,
    title: 'Public Verifier',
    badge: 'No login needed',
    desc: 'Verify any certificate instantly using a QR code or hash. See the issuer identity and blockchain proof — completely public.',
    points: ['Verify via QR code or hash', 'See issuer identity on-chain', 'Instant cryptographic proof', 'Zero account needed'],
    cta: 'Verify a Certificate',
    route: '/verify',
    primary: false,
  },
];

const trustFeatures = [
  { icon: <Key size={20} />, title: 'ECDSA Signatures', desc: 'Every certificate is signed with an ECDSA private key, ensuring authenticity at the cryptographic level.' },
  { icon: <Hash size={20} />, title: 'SHA-256 Hashing', desc: 'Certificate content is hashed with SHA-256. Any tampering instantly invalidates the fingerprint.' },
  { icon: <Network size={20} />, title: 'Hyperledger Fabric MSP', desc: 'Organisation identities verified via Fabric MSP — no impersonation possible.' },
  { icon: <ShieldCheck size={20} />, title: 'Decentralised Trust', desc: 'No central admin controls verification. Trust is distributed across the blockchain network.' },
];

export function FeatureGrid({ onLoginOpen }) {
  const navigate = useNavigate();
  const go = (route) => navigate(route);

  const handleRoleClick = (role) => {
    if (role.route === '/org/login') {
      onLoginOpen();
    } else {
      go(role.route);
    }
  };

  return (
    <>
      <section style={{ backgroundColor: '#f9fafb', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '0 0 10px' }}>How It Works</h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 400, margin: '0 auto' }}>
              A three-step lifecycle from issuance to trustless public verification.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, backgroundColor: '#e5e7eb', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            {[
              { step: '01', icon: <FileText size={24} />, title: 'Issue', desc: 'Organisations create and sign certificates using ECDSA keys tied to their Hyperledger Fabric identity.' },
              { step: '02', icon: <Database size={24} />, title: 'Store on Blockchain', desc: 'Certificate hashes and signatures are recorded immutably on the Fabric ledger — tamper-proof forever.' },
              { step: '03', icon: <ScanLine size={24} />, title: 'Verify Instantly', desc: 'Anyone can verify a certificate using a QR code or hash in seconds — no login, no middleman.' },
            ].map((item) => (
              <div key={item.step} style={{ backgroundColor: '#fff', padding: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: PM, lineHeight: 1 }}>{item.step}</span>
                <div style={{ width: 48, height: 48, backgroundColor: PL, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a202c', margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '0 0 10px' }}>Choose Your Role</h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 420, margin: '0 auto' }}>
              Bit-Cert serves three kinds of participants with dedicated, purpose-built interfaces.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {roles.map((role) => (
              <div
                key={role.title}
                style={{ backgroundColor: role.primary ? '#f6fbf6' : '#fff', border: `1.5px solid ${role.primary ? P : '#f0f0f0'}`, borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, backgroundColor: PL, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P }}>
                    {role.icon}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: P, backgroundColor: PL, padding: '4px 12px', borderRadius: 12 }}>{role.badge}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: '#1a202c', margin: '0 0 8px' }}>{role.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{role.desc}</p>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {role.points.map((pt) => (
                    <li key={pt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                      <CheckCircle2 size={14} style={{ color: P, flexShrink: 0 }} />
                      {pt}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleRoleClick(role)}
                  style={{ marginTop: 'auto', width: '100%', padding: '12px 0', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: role.primary ? P : 'transparent', color: role.primary ? '#fff' : P, border: role.primary ? 'none' : `2px solid ${P}`, transition: 'opacity 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {role.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: P, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>Built for Trust</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 400, margin: '0 auto' }}>
              Every design decision prioritises cryptographic verifiability with no central point of failure.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {trustFeatures.map((item) => (
              <div
                key={item.title}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 18, padding: 22, display: 'flex', flexDirection: 'column', gap: 14, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.17)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
              >
                <div style={{ width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{item.title}</h4>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {[
              [<BadgeCheck key="tamper" size={13} />, 'Tamper-proof'],
              [<Zap key="zap" size={13} />, 'Instant verification'],
              [<QrCode key="qr" size={13} />, 'QR-based sharing'],
              [<Lock key="lock" size={13} />, 'No central admin'],
            ].map(([icon, label]) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 16px', borderRadius: 20 }}>
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
