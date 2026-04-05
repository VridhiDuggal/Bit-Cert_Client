export function Section({ children, style = {}, ...props }) {
  return (
    <section style={{ padding: '80px 24px', ...style }} {...props}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}
