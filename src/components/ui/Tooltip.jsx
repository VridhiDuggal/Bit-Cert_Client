import { useState, useRef } from 'react';
import { RADIUS, DURATION } from '../../styles/tokens';

const POSITIONS = {
  top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
  bottom: { top: '100%',   left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
  left:   { right: '100%', top: '50%', transform: 'translateY(-50%)',  marginRight: 8 },
  right:  { left: '100%',  top: '50%', transform: 'translateY(-50%)',  marginLeft: 8 },
};

const ARROW_POSITIONS = {
  top:    { top: '100%',  left: '50%', transform: 'translateX(-50%)', borderColor: '#1a202c transparent transparent transparent' },
  bottom: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', borderColor: 'transparent transparent #1a202c transparent' },
  left:   { left: '100%', top: '50%', transform: 'translateY(-50%)',  borderColor: 'transparent transparent transparent #1a202c' },
  right:  { right: '100%', top: '50%', transform: 'translateY(-50%)', borderColor: 'transparent #1a202c transparent transparent' },
};

export function Tooltip({ content, position = 'top', children, style = {} }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  const pos = POSITIONS[position] ?? POSITIONS.top;
  const arrow = ARROW_POSITIONS[position] ?? ARROW_POSITIONS.top;

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          ...pos,
          backgroundColor: '#1a202c',
          color: '#fff',
          fontSize: 12,
          fontWeight: 500,
          padding: '5px 10px',
          borderRadius: RADIUS.sm,
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transition: `opacity ${DURATION.fast} ease`,
        }}
      >
        {content}
        <span
          style={{
            position: 'absolute',
            ...arrow,
            width: 0,
            height: 0,
            borderWidth: 4,
            borderStyle: 'solid',
          }}
        />
      </span>
    </span>
  );
}
