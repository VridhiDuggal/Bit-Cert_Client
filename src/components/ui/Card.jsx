export function Card({ children, style = {}, className = '', ...props }) {
  return (
    <div
      style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
