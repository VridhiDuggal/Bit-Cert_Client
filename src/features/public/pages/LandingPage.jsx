import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Database,
  ScanLine,
  Building2,
  UserCheck,
  Globe,
  Lock,
  Hash,
  Network,
  Key,
  ChevronRight,
  ArrowRight,
  BadgeCheck,
  QrCode,
  Zap,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

const P = '#588157';
const PL = '#eef4ee';
const PM = '#c8dfc8';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hash, setHash] = useState('');
  const [open, setOpen] = useState(false);

  const go = (route) => { navigate(route); setOpen(false); };

  const handleVerify = (e) => {
    e.preventDefault();
    const t = hash.trim();
    if (t) navigate(`/verify/${t}`);
  };

  const focusStyle = (e) => {
    e.target.style.outline = 'none';
    e.target.style.boxShadow = `0 0 0 2px ${P}`;
    e.target.style.borderColor = 'transparent';
  };
  const blurStyle = (e) => {
    e.target.style.boxShadow = '';
    e.target.style.borderColor = '#e5e7eb';
  };

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', color: '#1a202c', backgroundColor: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>

      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: P, letterSpacing: '-0.5px' }}>Bit-Cert</span>

          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
            {[['Verify', '/verify'], ['Organisation', '/org/login'], ['Recipient', '/recipient/login']].map(([label, route]) => (
              <button key={label} onClick={() => go(route)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#6b7280', padding: 0 }}
                onMouseEnter={e => e.target.style.color = '#1a202c'} onMouseLeave={e => e.target.style.color = '#6b7280'}>
                {label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => go('/login')} style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: `1.5px solid ${P}`, color: P, background: 'transparent', cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.backgroundColor = PL} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
              Sign In
            </button>
            <button onClick={() => go('/verify')} style={{ fontSize: 13, fontWeight: 700, padding: '8px 18px', borderRadius: 10, border: 'none', color: '#fff', backgroundColor: P, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              onMouseEnter={e => e.target.style.opacity = '0.88'} onMouseLeave={e => e.target.style.opacity = '1'}>
              Verify Certificate <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </header>

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
              <button onClick={() => go('/verify')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: 'none', backgroundColor: P, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(88,129,87,0.35)' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Verify Certificate <ArrowRight size={16} />
              </button>
              <button onClick={() => go('/org/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: `2px solid ${P}`, backgroundColor: 'transparent', color: P, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = PL} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                Organisation Login
              </button>
              <button onClick={() => go('/recipient/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: '1.5px solid #e5e7eb', backgroundColor: 'transparent', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                Recipient Login
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
                {[[<ShieldCheck size={18} />, 'ECDSA'], [<Network size={18} />, 'Fabric'], [<QrCode size={18} />, 'QR Verify']].map(([icon, label]) => (
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

      <section style={{ backgroundColor: '#f9fafb', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '0 0 10px' }}>How It Works</h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 400, margin: '0 auto' }}>A three-step lifecycle from issuance to trustless public verification.</p>
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
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 420, margin: '0 auto' }}>Bit-Cert serves three kinds of participants with dedicated, purpose-built interfaces.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
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
            ].map((role) => (
              <div key={role.title} style={{ backgroundColor: role.primary ? '#f6fbf6' : '#fff', border: `1.5px solid ${role.primary ? P : '#f0f0f0'}`, borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'}>
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

                <button onClick={() => go(role.route)} style={{ marginTop: 'auto', width: '100%', padding: '12px 0', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: role.primary ? P : 'transparent', color: role.primary ? '#fff' : P, border: role.primary ? 'none' : `2px solid ${P}`, transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
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
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 400, margin: '0 auto' }}>Every design decision prioritises cryptographic verifiability with no central point of failure.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { icon: <Key size={20} />, title: 'ECDSA Signatures', desc: 'Every certificate is signed with an ECDSA private key, ensuring authenticity at the cryptographic level.' },
              { icon: <Hash size={20} />, title: 'SHA-256 Hashing', desc: 'Certificate content is hashed with SHA-256. Any tampering instantly invalidates the fingerprint.' },
              { icon: <Network size={20} />, title: 'Hyperledger Fabric MSP', desc: 'Organisation identities verified via Fabric MSP — no impersonation possible.' },
              { icon: <ShieldCheck size={20} />, title: 'Decentralised Trust', desc: 'No central admin controls verification. Trust is distributed across the blockchain network.' },
            ].map((item) => (
              <div key={item.title} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 18, padding: 22, display: 'flex', flexDirection: 'column', gap: 14, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.17)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}>
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
            {[[<BadgeCheck size={13} />, 'Tamper-proof'], [<Zap size={13} />, 'Instant verification'], [<QrCode size={13} />, 'QR-based sharing'], [<Lock size={13} />, 'No central admin']].map(([icon, label]) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 16px', borderRadius: 20 }}>
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, backgroundColor: PL, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ScanLine size={26} style={{ color: P }} />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '0 0 10px' }}>Verify a Certificate Now</h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 32px' }}>
            Paste any certificate hash below to verify its authenticity on-chain instantly. No account or login required.
          </p>

          <form onSubmit={handleVerify} style={{ display: 'flex', gap: 10, maxWidth: 560, margin: '0 auto' }}>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Enter certificate hash or ID..."
              onFocus={focusStyle}
              onBlur={blurStyle}
              style={{ flex: 1, padding: '13px 16px', fontSize: 14, borderRadius: 12, border: '1.5px solid #e5e7eb', outline: 'none', transition: 'box-shadow 0.15s' }}
            />
            <button type="submit" disabled={!hash.trim()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 22px', fontSize: 13, fontWeight: 700, color: '#fff', backgroundColor: P, border: 'none', borderRadius: 12, cursor: hash.trim() ? 'pointer' : 'not-allowed', opacity: hash.trim() ? 1 : 0.45, flexShrink: 0, whiteSpace: 'nowrap' }}>
              Verify Now <ArrowRight size={14} />
            </button>
          </form>

          <p style={{ marginTop: 18, fontSize: 13, color: '#9ca3af' }}>
            Or{' '}
            <button onClick={() => go('/verify')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: P, textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>
              go to the full verification page
            </button>
            {' '}to scan a QR code
          </p>
        </div>
      </section>

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
                <button key={label} onClick={() => go(route)} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#9ca3af', padding: '4px 0', textAlign: 'left', width: '100%' }}
                  onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
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

    </div>
  );
}
