import { PRIMARY, ERROR, BORDER, TEXT, MUTED } from '../../styles/tokens';

export function Input({ id, label, type = 'text', error, hint, onBlur, ...rest }) {
  const handleBlur = (e) => {
    e.target.style.borderColor = error ? ERROR : BORDER;
    if (onBlur) onBlur(e);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        style={{
          padding: '10px 14px',
          fontSize: 14,
          borderRadius: 10,
          border: `1.5px solid ${error ? ERROR : BORDER}`,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = error ? ERROR : PRIMARY; }}
        onBlur={handleBlur}
        {...rest}
      />
      {hint && !error && (
        <span style={{ fontSize: 12, color: MUTED }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 12, color: ERROR }}>{error}</span>
      )}
    </div>
  );
}
