import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../../css/CertificateQRTab.css';

const CertificateQRTab = () => {
  const { certificate } = useOutletContext();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const verificationUrl = 'http://localhost:5173/verify';
  const qrData = JSON.stringify({
    certificateId: certificate.certificateId,
    certHash: certificate.certHash,
    verificationUrl,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 300, 300);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `QR-${certificate.certificateId}.png`;
      a.click();
    };

    img.src = url;
  };

  return (
    <div className="cert-qr-card">
      <div className="cert-qr-inner">
        <div className="cert-qr-box" ref={qrRef}>
          <QRCodeSVG value={qrData} size={250} level="H" />
        </div>
        <p className="cert-qr-caption">Scan to Verify Certificate</p>
        <p className="cert-qr-id">{certificate.certificateId}</p>
        <div className="cert-qr-actions">
          <button className="cert-qr-btn primary" onClick={handleCopyLink}>
            {copied ? 'Copied!' : 'Copy Verification Link'}
          </button>
          <button className="cert-qr-btn outline" onClick={handleDownloadQR}>
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateQRTab;
