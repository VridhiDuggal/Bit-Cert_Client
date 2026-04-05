import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from '../../store/toast/toastSlice';
import { PRIMARY, ERROR } from '../../styles/tokens';

const TYPE_STYLES = {
  success: { background: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', bar: PRIMARY },
  error:   { background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', bar: ERROR },
  info:    { background: '#eff6ff', border: '1.5px solid #93c5fd', color: '#1e40af', bar: '#3b82f6' },
};

export function ToastItem({ toast }) {
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const s = TYPE_STYLES[toast.type] ?? TYPE_STYLES.info;

  useEffect(() => {
    timerRef.current = setTimeout(() => dispatch(removeToast(toast.id)), toast.duration);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, dispatch]);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: s.background,
        border: s.border,
        borderRadius: 12,
        padding: '12px 40px 12px 16px',
        minWidth: 280,
        maxWidth: 380,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        fontSize: 13,
        fontWeight: 500,
        color: s.color,
        lineHeight: 1.5,
        animation: 'toastIn 0.2s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: '100%',
          background: s.bar,
          opacity: 0.35,
        }}
      />
      {toast.message}
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        aria-label="Dismiss"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          color: s.color,
          opacity: 0.6,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
