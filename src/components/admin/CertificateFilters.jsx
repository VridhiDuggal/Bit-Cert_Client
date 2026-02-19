import React, { useMemo } from 'react';
import '../../css/CertificateFilters.css';

const CertificateFilters = ({
  certificates,
  selectedIssuer,
  setSelectedIssuer,
  selectedStatus,
  setSelectedStatus,
}) => {
  const uniqueIssuers = useMemo(() => {
    const issuers = [...new Set(certificates.map((cert) => cert.issuerName))];
    return issuers.sort();
  }, [certificates]);

  return (
    <div className="certificate-filters-card">
      <div className="certificate-filters-row">
        <div className="filter-group">
          <label className="filter-label" htmlFor="issuer-filter">
            Issuer
          </label>
          <select
            id="issuer-filter"
            className="filter-select"
            value={selectedIssuer}
            onChange={(e) => setSelectedIssuer(e.target.value)}
          >
            <option value="">All Issuers</option>
            {uniqueIssuers.map((issuer) => (
              <option key={issuer} value={issuer}>
                {issuer}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="status-filter">
            Status
          </label>
          <select
            id="status-filter"
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Valid">Valid</option>
            <option value="Revoked">Revoked</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CertificateFilters;
