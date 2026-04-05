import { TEXT, BORDER, MUTED } from '../../styles/tokens';

export function Header({ title, subtitle }) {
  return (
    <header style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${BORDER}`,
      padding: '0 32px',
      backgroundColor: '#fff',
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0', fontWeight: 400 }}>{subtitle}</p>
        )}
      </div>
    </header>
  );
}
