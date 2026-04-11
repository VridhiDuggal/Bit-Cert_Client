import { useEffect, useState } from 'react';
import * as T from '../../styles/tokens';

export function VerificationChart({ weekly_counts, loading }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(id);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
        {[40, 28, 52, 36].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: h,
              borderRadius: '4px 4px 0 0',
              background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        ))}
      </div>
    );
  }

  const weeks = weekly_counts ?? [];
  const maxCount = Math.max(...weeks.map(w => w.count ?? 0), 1);
  const isEmpty = weeks.every(w => (w.count ?? 0) === 0);

  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
        {weeks.map((w, i) => {
          const barHeight = isEmpty ? 4 : Math.max(4, ((w.count ?? 0) / maxCount) * 56);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: '100%',
                  height: mounted ? barHeight : 0,
                  backgroundColor: isEmpty ? T.TEXT_MUTED : T.PRIMARY,
                  borderRadius: '4px 4px 0 0',
                  transition: `height 400ms ease ${i * 80}ms`,
                }}
              />
              <span style={{ fontSize: 9, color: T.TEXT_MUTED, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {w.week ?? `W${i + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
