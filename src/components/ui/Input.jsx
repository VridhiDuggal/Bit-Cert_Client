import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { PRIMARY, ERROR, BORDER, TEXT, MUTED } from '../../styles/tokens';

export function Input({ id, label, type = 'text', error, hint, onBlur, showToggle, ...rest }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showToggle ? (showPw ? 'text' : 'password') : type;

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
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={resolvedType}
          style={{
            padding: isPassword && showToggle ? '10px 40px 10px 14px' : '10px 14px',
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
        {isPassword && showToggle && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: MUTED,
              display: 'flex',
              alignItems: 'center',
            }}
            tabIndex={-1}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>
      {hint && !error && (
        <span style={{ fontSize: 12, color: MUTED }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 12, color: ERROR }}>{error}</span>
      )}
    </div>
  );
}
