import { useEffect, useState } from 'react';
import { Button } from './Button';
import { TEXT_MUTED, SPACING, DURATION } from '../../styles/tokens';

export function EmptyState({ icon: Icon, title, description, action, style = {} }) {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFloating(f => !f), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${SPACING.xxl}px ${SPACING.xl}px`,
        textAlign: 'center',
        gap: SPACING.md,
        ...style,
      }}
    >
      {Icon && (
        <span
          style={{
            display: 'inline-flex',
            transform: floating ? 'translateY(-6px)' : 'translateY(0)',
            transition: `transform 1.8s ease-in-out`,
          }}
        >
          <Icon size={48} color={TEXT_MUTED} strokeWidth={1.5} />
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.xs }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', margin: 0 }}>{title}</p>
        {description && (
          <p style={{ fontSize: 13, color: TEXT_MUTED, margin: 0, maxWidth: 320 }}>{description}</p>
        )}
      </div>
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          style={{ marginTop: SPACING.xs, transition: `opacity ${DURATION.normal}` }}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
