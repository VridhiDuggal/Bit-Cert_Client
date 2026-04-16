import { RecipientSidebar } from './RecipientSidebar';
import { RecipientHeader } from './RecipientHeader';

export function RecipientLayout({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, #eef4ee 0%, #f3f7f3 25%, #f8faf8 100%)' }}>
      <RecipientSidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <RecipientHeader title={title} subtitle={subtitle} />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
