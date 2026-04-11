import { RecipientSidebar } from './RecipientSidebar';
import { RecipientHeader } from './RecipientHeader';

export function RecipientLayout({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <RecipientSidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <RecipientHeader title={title} subtitle={subtitle} />
        <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
