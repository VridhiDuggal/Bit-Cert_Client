import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TEXT } from '../../styles/tokens';

const MAX_WIDTH = { sm: 360, md: 480, lg: 640 };

export function Modal({ isOpen, onClose, title, children, size = 'md', isDirty = false }) {
  const [warnClose, setWarnClose] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (isDirty) {
      setWarnClose(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setWarnClose(false);
    onClose();
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: 18,
          padding: 32,
          width: '100%',
          maxWidth: MAX_WIDTH[size] ?? MAX_WIDTH.md,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
          <button
            onClick={handleBackdropClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#9ca3af', lineHeight: 1, padding: 0 }}
          >
            ×
          </button>
        </div>
        {warnClose && (
          <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: 10, fontSize: 13, color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span>Close and lose your progress?</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setWarnClose(false)} style={{ fontSize: 12, fontWeight: 600, color: '#92400e', background: 'none', border: 'none', cursor: 'pointer' }}>Keep editing</button>
              <button onClick={confirmClose} style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Discard</button>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
