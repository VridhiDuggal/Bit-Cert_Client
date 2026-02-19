import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../css/IssueCertificate.css';

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    certificateTitle: '',
    issueDate: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add certificate issuance logic here
  };

  return (
    <div className="issue-certificate">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <h1 className="dashboard-title">Issue Certificate</h1>
          <form onSubmit={handleSubmit} className="certificate-form">
            <div className="form-group">
              <label htmlFor="recipientName">Recipient Name</label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Enter recipient name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="recipientEmail">Recipient Email</label>
              <input
                type="email"
                id="recipientEmail"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleChange}
                placeholder="Enter recipient email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="certificateTitle">Certificate Title</label>
              <input
                type="text"
                id="certificateTitle"
                name="certificateTitle"
                value={formData.certificateTitle}
                onChange={handleChange}
                placeholder="Enter certificate title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="issueDate">Issue Date</label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter certificate description"
                rows="4"
              />
            </div>
            <button type="submit" className="submit-button">Issue Certificate</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default IssueCertificate;
