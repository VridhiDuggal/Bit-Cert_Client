import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function OrgLayout({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header title={title} subtitle={subtitle} />
        <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
