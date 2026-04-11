import { BORDER, TEXT, MUTED, TEXT_SECONDARY, BORDER_STRONG, SURFACE, RADIUS, SPACING, DURATION, PRIMARY, DANGER } from '../../styles/tokens';

export function FilterBar({ filters = [], values = {}, onChange, onReset, style = {} }) {
  const activeCount = filters.reduce((acc, f) => {
    const v = values[f.key];
    return acc + (v && v !== '' && v !== 'all' ? 1 : 0);
  }, 0);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: SPACING.md,
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {filters.map((filter) => (
        <div key={filter.key} style={{ display: 'flex', flexDirection: 'column', gap: SPACING.xs }}>
          <label
            style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6 }}
          >
            {filter.label}
          </label>
          <select
            value={values[filter.key] ?? ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            style={{
              padding: '7px 32px 7px 12px',
              fontSize: 13,
              fontWeight: 500,
              color: TEXT,
              backgroundColor: SURFACE,
              border: `1.5px solid ${BORDER}`,
              borderRadius: RADIUS.md,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              transition: `border-color ${DURATION.fast}`,
            }}
            onFocus={(e) => { e.target.style.borderColor = PRIMARY; }}
            onBlur={(e) => { e.target.style.borderColor = BORDER; }}
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}

      {onReset && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.xs }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'transparent', userSelect: 'none' }}>.</label>
          <button
            onClick={onReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: activeCount > 0 ? DANGER : MUTED,
              backgroundColor: 'transparent',
              border: `1.5px solid ${activeCount > 0 ? DANGER : BORDER}`,
              borderRadius: RADIUS.md,
              cursor: 'pointer',
              transition: `all ${DURATION.fast}`,
            }}
          >
            Reset
            {activeCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: DANGER,
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {activeCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
