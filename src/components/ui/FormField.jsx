import { BORDER, ERROR, MUTED, TEXT } from '../../styles/tokens';

export function FormField({ id, label, hint, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <span style={{ fontSize: 12, color: MUTED }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 12, color: ERROR }}>{error}</span>
      )}
    </div>
  );
}
