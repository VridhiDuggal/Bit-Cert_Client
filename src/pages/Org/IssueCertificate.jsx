import { OrgLayout } from '../../components/org/OrgLayout';
import { MUTED } from '../../styles/tokens';

export default function IssueCertificate() {
  return (
    <OrgLayout title="Issue Certificate" subtitle="Issue a signed certificate to a recipient.">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <p style={{ color: MUTED, fontSize: 14 }}>Certificate issuance form — coming soon.</p>
      </div>
    </OrgLayout>
  );
}
