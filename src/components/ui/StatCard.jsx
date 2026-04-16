import { useEffect, useRef, useState } from 'react';
import { Loader } from './Loader';
import { TEXT, MUTED, BORDER, WHITE, SHADOW, SPACING, RADIUS, DURATION } from '../../styles/tokens';

function Shimmer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}

function useCountUp(target, enabled) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof target !== 'number') return;
    const start = Date.now();
    const duration = 900;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, enabled]);

  return value;
}

const TREND_COLORS = { up: '#22c55e', down: '#ef4444', neutral: MUTED };
const TREND_ARROWS = { up: '↑', down: '↓', neutral: '→' };

export function StatCard({ title, value, icon: Icon, trend, color = '#3B82F6', loading = false, style = {} }) {
  const [hovered, setHovered] = useState(false);
  const isLoading = loading || value === null;
  const displayValue = useCountUp(typeof value === 'number' ? value : 0, !isLoading);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: WHITE,
        borderRadius: RADIUS.lg,
        border: `1px solid ${BORDER}`,
        padding: `${SPACING.lg}px`,
        overflow: 'hidden',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? SHADOW.lg : SHADOW.sm,
        transition: `transform ${DURATION.normal} ease, box-shadow ${DURATION.normal} ease`,
        cursor: 'default',
        ...style,
      }}
    >
      {isLoading && (
        <>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: WHITE, zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2 }}>
            <Shimmer />
          </div>
          <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: SPACING.sm }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.7, margin: 0 }}>
            {title}
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: TEXT, margin: `${SPACING.xs}px 0 0`, lineHeight: 1 }}>
            {isLoading ? <span style={{ display: 'inline-block', width: 64, height: 28, backgroundColor: '#e5e7eb', borderRadius: RADIUS.sm }} /> : displayValue}
          </p>
          {trend && !isLoading && (
            <p style={{ fontSize: 12, fontWeight: 600, color: TREND_COLORS[trend.direction] ?? MUTED, margin: `${SPACING.xs}px 0 0` }}>
              {TREND_ARROWS[trend.direction]} {trend.value}
            </p>
          )}
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: RADIUS.md,
            backgroundColor: `${color}1a`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {Icon && <Icon size={20} color={color} strokeWidth={2} />}
        </div>
      </div>
    </div>
  );
}
