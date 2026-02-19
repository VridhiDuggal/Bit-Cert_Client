import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CertificatePreviewModal from './CertificatePreviewModal';
import '../../css/IssueCertificateForm.css';

const generateRandomHex = (length) => {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const IssuerIssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    enrollmentNo: '',
    courseName: '',
    grade: '',
    issueDate: '',
    description: '',
  });

  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [generatedCert, setGeneratedCert] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      studentName: '',
      studentEmail: '',
      enrollmentNo: '',
      courseName: '',
      grade: '',
      issueDate: '',
      description: '',
    });
    setGeneratedCert(null);
    setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const certificateId = `CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    const certHash = generateRandomHex(64);
    const blockchainTxId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const ipfsHash = `Qm${generateRandomString(44)}`;

    const certificate = {
      id: issuedCertificates.length + 1,
      certificateId,
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      enrollmentNo: formData.enrollmentNo,
      courseName: formData.courseName,
      grade: formData.grade,
      description: formData.description,
      issuedAt: formData.issueDate,
      certHash,
      blockchainTxId,
      ipfsHash,
      status: 'Valid',
    };

    setIssuedCertificates((prev) => [...prev, certificate]);
    setGeneratedCert(certificate);
    setSuccessMessage(`Certificate ${certificateId} generated successfully!`);

    setFormData({
      studentName: '',
      studentEmail: '',
      enrollmentNo: '',
      courseName: '',
      grade: '',
      issueDate: '',
      description: '',
    });
  };

  const qrData = generatedCert
    ? JSON.stringify({
        certificateId: generatedCert.certificateId,
        certHash: generatedCert.certHash,
        verificationUrl: 'http://localhost:5173/verify',
      })
    : '';

  return (
    <div className="issue-cert-page">
      <div className="issue-cert-header">
        <h1 className="issue-cert-heading">Issue Certificate</h1>
        <p className="issue-cert-subtitle">
          Fill in the details below to generate a new blockchain-verified certificate
        </p>
      </div>

      {successMessage && (
        <div className="issue-cert-success">{successMessage}</div>
      )}

      <div className="issue-cert-content">
        <div className="issue-cert-form-card">
          <h3 className="issue-cert-section-title">Certificate Details</h3>
          <form onSubmit={handleSubmit} className="issue-cert-form">
            <div className="issue-form-row">
              <div className="issue-form-group">
                <label htmlFor="studentName">Student Name</label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student full name"
                  required
                />
              </div>
              <div className="issue-form-group">
                <label htmlFor="studentEmail">Student Email</label>
                <input
                  type="email"
                  id="studentEmail"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  required
                />
              </div>
            </div>

            <div className="issue-form-row">
              <div className="issue-form-group">
                <label htmlFor="enrollmentNo">Enrollment No</label>
                <input
                  type="text"
                  id="enrollmentNo"
                  name="enrollmentNo"
                  value={formData.enrollmentNo}
                  onChange={handleChange}
                  placeholder="e.g. STU-2021-1001"
                  required
                />
              </div>
              <div className="issue-form-group">
                <label htmlFor="courseName">Course Name</label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech in Computer Science"
                  required
                />
              </div>
            </div>

            <div className="issue-form-row">
              <div className="issue-form-group">
                <label htmlFor="grade">Grade</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="e.g. A+"
                  required
                />
              </div>
              <div className="issue-form-group">
                <label htmlFor="issueDate">Issue Date</label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="issue-form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the certificate..."
                rows="3"
                required
              />
            </div>

            <div className="issue-form-actions">
              <button type="submit" className="issue-btn-primary">
                Generate Certificate
              </button>
              <button type="button" className="issue-btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>

        {generatedCert && (
          <div className="issue-cert-preview-card">
            <h3 className="issue-cert-section-title">Generated Certificate</h3>
            <div className="issue-preview-qr">
              <QRCodeSVG value={qrData} size={160} level="H" />
            </div>
            <div className="issue-preview-info">
              <div className="issue-preview-item">
                <span className="issue-preview-label">Certificate ID</span>
                <span className="issue-preview-value">{generatedCert.certificateId}</span>
              </div>
              <div className="issue-preview-item">
                <span className="issue-preview-label">Student</span>
                <span className="issue-preview-value">{generatedCert.studentName}</span>
              </div>
              <div className="issue-preview-item">
                <span className="issue-preview-label">Course</span>
                <span className="issue-preview-value">{generatedCert.courseName}</span>
              </div>
              <div className="issue-preview-item">
                <span className="issue-preview-label">Hash</span>
                <span className="issue-preview-value issue-hash-text">
                  {generatedCert.certHash.substring(0, 10)}...
                </span>
              </div>
              <div className="issue-preview-item">
                <span className="issue-preview-label">Status</span>
                <span className="issue-preview-badge">Valid</span>
              </div>
            </div>
            <button
              className="issue-btn-view-details"
              onClick={() => setShowModal(true)}
            >
              View Full Details
            </button>
          </div>
        )}
      </div>

      {showModal && generatedCert && (
        <CertificatePreviewModal
          certificate={generatedCert}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default IssuerIssueCertificate;
