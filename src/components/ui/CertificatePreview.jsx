import * as T from '../../styles/tokens';

export function CertificatePreview({ orgName, recipientName, course, issueDate, isRevoked }) {
  const formatted = issueDate
    ? new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 480,
      aspectRatio: '1.41 / 1',
      backgroundColor: T.WHITE,
      border: `2px solid ${T.PRIMARY}`,
      borderRadius: T.RADIUS.lg,
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <div style={{
        position: 'absolute',
        inset: 8,
        border: `1px solid ${T.PRIMARY}4D`,
        borderRadius: T.RADIUS.md,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 24,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: T.MUTED, textTransform: 'uppercase' }}>
          Certificate of Completion
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: T.TEXT }}>
          {orgName ?? '—'}
        </div>
        <div style={{ fontSize: 11, color: T.MUTED }}>
          This is to certify that
        </div>
        <div style={{ fontSize: 26, fontWeight: 500, color: T.PRIMARY }}>
          {recipientName ?? '—'}
        </div>
        <div style={{ fontSize: 11, color: T.MUTED }}>
          has successfully completed
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: T.TEXT }}>
          {course ?? '—'}
        </div>
        <div style={{ fontSize: 11, color: T.TEXT_MUTED, marginTop: 4 }}>
          {formatted}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 14, right: 20, fontSize: 9, color: T.TEXT_MUTED }}>
        Bit-Cert
      </div>

      {isRevoked && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            backgroundColor: T.DANGER,
            color: T.WHITE,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 6,
            padding: '8px 48px',
            transform: 'rotate(45deg)',
            opacity: 0.85,
            whiteSpace: 'nowrap',
          }}>
            REVOKED
          </div>
        </div>
      )}
    </div>
  );
}
