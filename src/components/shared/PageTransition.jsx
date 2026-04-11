import { useState, useEffect } from 'react';

export function PageTransition({ children }) {
  const [phase, setPhase] = useState('hidden'); // hidden → animating → done

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('animating'));
    return () => cancelAnimationFrame(raf);
  }, []);

  const style = phase === 'done'
    ? {} // no inline styles at all — zero stacking context created
    : {
        opacity:    phase === 'animating' ? 1 : 0,
        transform:  phase === 'animating' ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 250ms ease, transform 250ms ease',
      };

  return (
    <div
      style={style}
      onTransitionEnd={() => setPhase('done')}
    >
      {children}
    </div>
  );
}
