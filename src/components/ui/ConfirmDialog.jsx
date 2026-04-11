import { TEXT, DANGER, BORDER, SHADOW, RADIUS, SPACING, MUTED } from '../../styles/tokens';
import { Button } from './Button';
import { Input } from './Input';

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  requirePassword = false,
  password = '',
  onPasswordChange,
  passwordError,
  loading = false,
}) {
  if (!isOpen) return null;

  const dangerStyle = confirmVariant === 'danger'
    ? { backgroundColor: DANGER, color: '#fff', border: 'none' }
    : undefined;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: SPACING.lg,
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: RADIUS.lg,
          padding: SPACING.xl,
          width: '100%',
          maxWidth: 420,
          boxShadow: SHADOW.xl,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: `0 0 ${SPACING.sm}px` }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: MUTED, margin: `0 0 ${SPACING.md}px`, lineHeight: 1.6 }}>
          {message}
        </p>

        {requirePassword && (
          <div style={{ marginBottom: SPACING.md }}>
            <Input
              label="Enter your password to confirm"
              type="password"
              value={password}
              onChange={e => onPasswordChange(e.target.value)}
              error={passwordError}
              placeholder="Your current password"
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end', borderTop: `1px solid ${BORDER}`, paddingTop: SPACING.md }}>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={onConfirm}
            style={dangerStyle}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
