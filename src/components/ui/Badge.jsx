import { useEffect, useState } from 'react';
import { DANGER, WARNING, INFO, SUCCESS, DURATION, RADIUS } from '../../styles/tokens';

const VARIANT_MAP = {
  success: { bg: SUCCESS, text: SUCCESS },
  danger:  { bg: DANGER,  text: DANGER  },
  warning: { bg: WARNING, text: WARNING },
  info:    { bg: INFO,    text: INFO    },
  neutral: { bg: '#6b7280', text: '#6b7280' },
};

const SIZE_MAP = {
  sm: { fontSize: 11, padding: '2px 8px' },
  md: { fontSize: 12, padding: '3px 10px' },
};

export function Badge({ variant = 'neutral', size = 'md', children, style = {} }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { bg, text } = VARIANT_MAP[variant] ?? VARIANT_MAP.neutral;
  const { fontSize, padding } = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: RADIUS.full,
        fontWeight: 600,
        letterSpacing: 0.3,
        backgroundColor: `${bg}26`,
        color: text,
        fontSize,
        padding,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.85)',
        transition: `opacity ${DURATION.normal} ease, transform ${DURATION.normal} ease`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
