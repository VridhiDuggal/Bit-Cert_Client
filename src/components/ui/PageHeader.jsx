import { Button } from './Button';
import { TEXT, MUTED, BORDER, SPACING, SHADOW } from '../../styles/tokens';

export function PageHeader({ title, subtitle, actions = [], style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: SPACING.lg,
        borderBottom: `1px solid ${BORDER}`,
        marginBottom: SPACING.lg,
        gap: SPACING.md,
        flexWrap: 'wrap',
        ...style,
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 0', fontWeight: 400 }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions.length > 0 && (
        <div style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap' }}>
          {actions.map((action, i) => (
            <Button
              key={i}
              variant={action.variant ?? 'primary'}
              onClick={action.onClick}
              style={{ boxShadow: SHADOW.sm }}
            >
              {action.icon && <action.icon size={15} />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
