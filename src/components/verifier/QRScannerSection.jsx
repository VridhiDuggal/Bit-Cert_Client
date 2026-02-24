import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';
import { verifierMockCertificatesData } from '../../data/verifierMockCertificatesData';
import '../../css/QRScannerSection.css';

const QRScannerSection = () => {
  const [mode, setMode] = useState('upload');
  const [scanResult, setScanResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const processQRText = (text) => {
    setScanResult(text);
    try {
      const parsed = JSON.parse(text);
      const certId = parsed.certificateId;
      const found = verifierMockCertificatesData.find((cert) => cert.certificateId === certId);
      navigate(found ? `/verifier/result/${found.certificateId}` : '/verifier/result/invalid');
    } catch {
      const found = verifierMockCertificatesData.find((cert) => cert.certificateId === text);
      navigate(found ? `/verifier/result/${found.certificateId}` : '/verifier/result/invalid');
    }
  };

  const handleCameraResult = (result) => {
    if (result) processQRText(result?.text);
  };

  const handleFileUpload = (e) => {
    setUploadError('');
    setScanResult(null);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          processQRText(code.data);
        } else {
          setUploadError('No QR code detected in this image. Please try a clearer image.');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setScanResult(null);
    setUploadError('');
  };

  return (
    <div className="qr-scanner-section">
      <div className="qr-scanner-card">
        <h3 className="qr-title">Scan QR to Verify</h3>
        <p className="qr-helper-text">Upload a QR code image or use your camera to scan.</p>

        {/* Mode Toggle */}
        <div className="qr-mode-toggle">
          <button
            className={`qr-mode-btn${mode === 'upload' ? ' active' : ''}`}
            onClick={() => switchMode('upload')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload QR Image
          </button>
          <button
            className={`qr-mode-btn${mode === 'camera' ? ' active' : ''}`}
            onClick={() => switchMode('camera')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Scan with Camera
          </button>
        </div>

        {/* Upload Area */}
        {mode === 'upload' && (
          <div className="qr-upload-area" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="qr-file-input"
              onChange={handleFileUpload}
            />
            <div className="qr-upload-icon">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#588157" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <path d="M14 14h3v3h-3zM17 17h3M17 14v3" />
              </svg>
            </div>
            <p className="qr-upload-text">Click to upload QR image</p>
            <p className="qr-upload-hint">Supports PNG, JPG, WEBP</p>
            {uploadError && <p className="qr-upload-error">{uploadError}</p>}
          </div>
        )}

        {/* Camera Area */}
        {mode === 'camera' && (
          <div className="qr-camera-area">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={handleCameraResult}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {scanResult && (
          <div className="qr-scan-result">
            <strong>Scanned:</strong> {scanResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerSection;
