import { useSelector } from 'react-redux';
import { selectOrg } from '../../store/auth/authSelectors';
import { OrgLayout } from '../../components/org/OrgLayout';
import { PRIMARY, PRIMARY_LIGHT, BG_SUBTLE, BORDER, TEXT, MUTED } from '../../styles/tokens';

export default function OrgDashboard() {
  const org = useSelector(selectOrg);

  return (
    <OrgLayout title="Dashboard" subtitle={org?.org_name}>
      <div style={{ maxWidth: 720 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${BORDER}` }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: PRIMARY_LIGHT, color: PRIMARY, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 20 }}>
            Organisation Dashboard
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: '0 0 8px' }}>
            Welcome, {org?.org_name}
          </h1>
          <p style={{ fontSize: 15, color: MUTED, margin: '0 0 32px' }}>
            Manage your certificates and recipients from the sidebar.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['Organisation', org?.org_name], ['Email', org?.email]].map(([label, value]) => (
              <div key={label} style={{ backgroundColor: BG_SUBTLE, borderRadius: 12, padding: '16px 20px', border: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}
