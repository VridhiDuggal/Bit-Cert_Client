import { PRIMARY } from '../../styles/tokens';

export function Loader({ size = 'md' }) {
  const dim = size === 'sm' ? 16 : 24;
  return (
    <span
      style={{
        display: 'inline-block',
        width: dim,
        height: dim,
        border: `2px solid ${PRIMARY}33`,
        borderTopColor: PRIMARY,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );
}
