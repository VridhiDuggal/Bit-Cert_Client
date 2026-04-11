import { DANGER } from '../../styles/tokens';

export function UnreadBadge({ count }) {
  if (!count || count < 1) return null;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 18,
      height: 18,
      borderRadius: 10,
      backgroundColor: DANGER + '26',
      color: DANGER,
      fontSize: 11,
      fontWeight: 600,
      padding: '1px 6px',
      lineHeight: 1,
    }}>
      {count > 99 ? '99+' : count}
    </span>
  );
}
