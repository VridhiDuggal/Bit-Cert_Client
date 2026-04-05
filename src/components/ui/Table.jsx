import { Loader } from './Loader';
import { PRIMARY, BORDER, TEXT, MUTED, BG_SUBTLE } from '../../styles/tokens';

export function Table({ columns, data, total, page, limit, onPageChange, loading, emptyMessage = 'No results.' }) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const hasPrev = page > 1;
  const hasNext = page * limit < total;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      <div style={{ position: 'relative', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: BG_SUBTLE, borderBottom: `1px solid ${BORDER}` }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: '32px 16px', textAlign: 'center', color: MUTED, fontSize: 13 }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr
                key={row.id ?? i}
                style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = BG_SUBTLE)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '12px 16px', color: TEXT, verticalAlign: 'middle' }}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader size="md" />
          </div>
        )}
      </div>

      {total > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: `1px solid ${BORDER}`, backgroundColor: BG_SUBTLE }}>
          <span style={{ fontSize: 12, color: MUTED }}>
            Showing {start}–{end} of {total}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrev}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 8,
                border: `1.5px solid ${BORDER}`,
                backgroundColor: '#fff',
                color: hasPrev ? TEXT : MUTED,
                cursor: hasPrev ? 'pointer' : 'not-allowed',
                opacity: hasPrev ? 1 : 0.5,
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNext}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 8,
                border: `1.5px solid ${PRIMARY}`,
                backgroundColor: hasNext ? PRIMARY : '#fff',
                color: hasNext ? '#fff' : MUTED,
                cursor: hasNext ? 'pointer' : 'not-allowed',
                opacity: hasNext ? 1 : 0.5,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
