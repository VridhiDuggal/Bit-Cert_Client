import { useState } from 'react';
import { issuerVerificationData } from '../../data/issuerVerificationData';
import VerificationActivityTable from './VerificationActivityTable';
import '../../css/VerificationActivity.css';

function VerificationActivity() {
  const [logs] = useState(issuerVerificationData);

  return (
    <div className="va-page">
      <div className="va-header">
        <h1 className="va-title">Verification Activity</h1>
        <p className="va-subtitle">Track verification requests for issued certificates</p>
      </div>
      <VerificationActivityTable logs={logs} />
    </div>
  );
}

export default VerificationActivity;
