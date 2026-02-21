import React from 'react';
import { useParams, NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { studentCertificatesData } from '../../data/studentCertificatesData';
import '../../css/CertificateLayout.css';

const CertificateLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const certificate = studentCertificatesData.find(
    (cert) => cert.id === parseInt(id)
  );

  if (!certificate) {
    return (
      <div className="cert-layout-not-found">
        <h2>Certificate Not Found</h2>
        <p>The certificate you are looking for does not exist or has been removed.</p>
        <button
          className="cert-layout-back-btn"
          onClick={() => navigate('/student/certificates')}
        >
          Back to My Certificates
        </button>
      </div>
    );
  }

  const tabs = [
    { label: 'Certificate Preview', path: 'preview' },
    { label: 'Certificate Details', path: 'details' },
    { label: 'QR Verification', path: 'qr' },
    { label: 'Verification History', path: 'history' },
  ];

  return (
    <div className="cert-layout-container">
      {/* Back button */}
      <div className="cert-layout-topbar">
        <button
          className="cert-layout-back-btn"
          onClick={() => navigate('/student/certificates')}
        >
          &larr; Back to My Certificates
        </button>
        <div className="cert-layout-cert-title">
          <span className="cert-layout-cert-name">{certificate.courseName}</span>
          <span className={`cert-layout-badge ${certificate.status === 'Valid' ? 'valid' : 'revoked'}`}>
            {certificate.status}
          </span>
        </div>
      </div>

      {/* Glass morphism tab nav */}
      <nav className="cert-layout-tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`/student/certificates/${id}/${tab.path}`}
            className={({ isActive }) =>
              `cert-layout-tab${isActive ? ' active' : ''}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Tab content */}
      <div className="cert-layout-content">
        <Outlet context={{ certificate }} />
      </div>
    </div>
  );
};

export default CertificateLayout;
