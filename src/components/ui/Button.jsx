import { Loader } from './Loader';
import { PRIMARY } from '../../styles/tokens';

export function Button({ variant = 'primary', loading = false, children, className = '', style = {}, disabled, ...props }) {
  const base = {
    primary: { backgroundColor: PRIMARY, color: '#fff', border: 'none' },
    outline: { backgroundColor: 'transparent', color: PRIMARY, border: `2px solid ${PRIMARY}` },
    ghost: { backgroundColor: 'transparent', color: PRIMARY, border: 'none' },
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      style={{
        padding: '10px 20px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        opacity: disabled || loading ? 0.65 : 1,
        transition: 'opacity 0.15s',
        ...base,
        ...style,
      }}
      className={className}
      {...props}
    >
      {loading && <Loader size="sm" />}
      {children}
    </button>
  );
}
