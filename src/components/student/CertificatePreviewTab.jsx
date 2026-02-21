import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from './CertificateTemplate';
import '../../css/CertificatePreviewTab.css';

const CertificatePreviewTab = () => {
  const { certificate } = useOutletContext();
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef();

  const handleDownload = async () => {
    const element = certificateRef.current;
    if (!element) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 30;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const yOffset = (pageHeight - imgHeight) / 2;
      pdf.addImage(
        data,
        'PNG',
        margin,
        yOffset > 0 ? yOffset : margin,
        imgWidth,
        imgHeight
      );
      pdf.save(`${certificate.certificateId}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="cert-prev-card">
      <div className="cert-prev-header">
        <div>
          <h3 className="cert-prev-title">Certificate Preview</h3>
          <p className="cert-prev-subtitle">
            This is how your certificate looks. Download a PDF copy to share or print.
          </p>
        </div>
        <button
          className="cert-prev-download-btn"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Generating PDF…' : '⬇ Download Certificate PDF'}
        </button>
      </div>

      <div className="cert-prev-template-wrap" ref={certificateRef}>
        <CertificateTemplate certificate={certificate} />
      </div>
    </div>
  );
};

export default CertificatePreviewTab;
