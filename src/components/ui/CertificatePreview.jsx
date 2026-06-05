import * as T from '../../styles/tokens';

export function CertificatePreview({ orgName, recipientName, course, issueDate, isRevoked }) {
  const formatted = issueDate
    ? new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '1.41 / 1',
      backgroundColor: T.WHITE,
      border: `2px solid ${T.PRIMARY}`,
      borderRadius: T.RADIUS.lg,
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>
      {/* Outer decorative border */}
      <div style={{
        position: 'absolute',
        inset: 10,
        border: `1px solid ${T.PRIMARY}4D`,
        borderRadius: T.RADIUS.md,
        pointerEvents: 'none',
      }} />

      {/* Corner ornaments */}
      {[
        { top: 16, left: 16 },
        { top: 16, right: 16 },
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos,
          width: 18, height: 18,
          borderTop: i < 2 ? `2px solid ${T.PRIMARY}80` : 'none',
          borderBottom: i >= 2 ? `2px solid ${T.PRIMARY}80` : 'none',
          borderLeft: i % 2 === 0 ? `2px solid ${T.PRIMARY}80` : 'none',
          borderRight: i % 2 === 1 ? `2px solid ${T.PRIMARY}80` : 'none',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Background watermark */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: 0.03,
        fontSize: 'clamp(60px, 12vw, 120px)',
        fontWeight: 900,
        color: T.PRIMARY,
        userSelect: 'none',
        letterSpacing: 8,
      }}>
        CERTIFIED
      </div>

      {/* Main content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(20px, 5%, 40px) clamp(24px, 8%, 60px)',
        textAlign: 'center',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 'clamp(7px, 1.2vw, 11px)', letterSpacing: 4, color: T.MUTED, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            Certificate of Completion
          </div>
          <div style={{ width: 40, height: 1.5, backgroundColor: `${T.PRIMARY}60`, margin: '4px 0' }} />
          <div style={{ fontSize: 'clamp(9px, 1.6vw, 14px)', fontWeight: 600, color: T.TEXT, fontFamily: 'sans-serif', letterSpacing: 0.5 }}>
            {orgName ?? '—'}
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(4px, 1.2vw, 10px)' }}>
          <div style={{ fontSize: 'clamp(8px, 1.2vw, 11px)', color: T.MUTED, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            This is to certify that
          </div>
          <div style={{
            fontSize: 'clamp(16px, 3.5vw, 30px)',
            fontWeight: 400,
            color: T.PRIMARY,
            fontStyle: 'italic',
            lineHeight: 1.2,
            maxWidth: '80%',
          }}>
            {recipientName ?? '—'}
          </div>
          <div style={{ fontSize: 'clamp(8px, 1.2vw, 11px)', color: T.MUTED, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            has successfully completed
          </div>
          <div style={{
            fontSize: 'clamp(12px, 2.2vw, 20px)',
            fontWeight: 600,
            color: T.TEXT,
            lineHeight: 1.3,
            maxWidth: '75%',
          }}>
            {course ?? '—'}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 40, height: 1.5, backgroundColor: `${T.PRIMARY}60`, marginBottom: 4 }} />
          <div style={{ fontSize: 'clamp(7px, 1.1vw, 10px)', color: T.TEXT_MUTED, fontFamily: 'sans-serif', letterSpacing: 0.5 }}>
            {formatted}
          </div>
          <div style={{ fontSize: 'clamp(6px, 0.9vw, 9px)', color: `${T.TEXT_MUTED}99`, fontFamily: 'sans-serif', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
            Bit-Cert · Blockchain Verified
          </div>
        </div>
      </div>

      {isRevoked && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            backgroundColor: T.DANGER,
            color: T.WHITE,
            fontSize: 'clamp(14px, 2.5vw, 22px)',
            fontWeight: 700,
            letterSpacing: 6,
            padding: '8px 48px',
            transform: 'rotate(-20deg)',
            opacity: 0.85,
            whiteSpace: 'nowrap',
            fontFamily: 'sans-serif',
          }}>
            REVOKED
          </div>
        </div>
      )}
    </div>
  );
}

