import { Search, X } from 'lucide-react';
import { PRIMARY, BORDER, TEXT, MUTED, SURFACE, RADIUS, SPACING, DURATION } from '../../styles/tokens';

export function SearchBar({ value, onChange, placeholder = 'Search…', onClear, style = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        ...style,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 12,
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
          color: MUTED,
        }}
      >
        <Search size={15} />
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: `9px 38px 9px 36px`,
          fontSize: 13,
          fontWeight: 400,
          color: TEXT,
          backgroundColor: SURFACE,
          border: `1.5px solid ${BORDER}`,
          borderRadius: RADIUS.md,
          outline: 'none',
          transition: `border-color ${DURATION.fast} ease`,
          boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.target.style.borderColor = PRIMARY; }}
        onBlur={(e) => { e.target.style.borderColor = BORDER; }}
      />

      {value && onClear && (
        <button
          onClick={onClear}
          style={{
            position: 'absolute',
            right: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: MUTED,
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            padding: 0,
            flexShrink: 0,
            transition: `background-color ${DURATION.fast}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = TEXT; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = MUTED; }}
        >
          <X size={11} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
