import { useState } from 'react';
import { Award, Eye, ExternalLink, Share2, Download, QrCode } from 'lucide-react';
import { Badge } from './Badge';
import { Tooltip } from './Tooltip';
import * as T from '../../styles/tokens';

export function CertificateCard({ certificate, onView, onShare, onDownload, onVerify, onQR }) {
  const [hovered, setHovered] = useState(false);
  const isRevoked = certificate.is_revoked;
  const isExpired = certificate.is_expired;

  const issueDate = certificate.issue_date
    ? new Date(certificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';

  const expiryDate = certificate.expiry_date
    ? new Date(certificate.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: T.WHITE,
        borderRadius: T.RADIUS.lg,
        border: `1px solid ${T.BORDER}`,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: hovered ? T.SHADOW.md : T.SHADOW.sm,
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: `box-shadow ${T.DURATION.normal} ease, transform ${T.DURATION.normal} ease`,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Badge variant={isRevoked ? 'danger' : isExpired ? 'warning' : 'success'} size="sm">
          {isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'}
        </Badge>
      </div>

      <div style={{ opacity: isRevoked ? 0.7 : 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
        <Award size={24} color={T.PRIMARY} />
        <div style={{
          fontSize: 16,
          fontWeight: 500,
          color: T.TEXT,
          textDecoration: isRevoked ? 'line-through' : 'none',
          lineHeight: 1.3,
        }}>
          {certificate.course_name ?? certificate.course ?? '—'}
        </div>
        <div style={{ fontSize: 13, color: T.MUTED }}>
          Issued by {certificate.org_name ?? '—'}
        </div>
        <div style={{ fontSize: 12, color: T.TEXT_MUTED }}>
          Issued on {issueDate}
        </div>
        {expiryDate && (
          <div style={{ fontSize: 12, color: isExpired ? T.DANGER : T.MUTED }}>
            {isExpired ? 'Expired' : 'Expires'}: {expiryDate}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
        <IconButton icon={<Eye size={15} />} tooltip="View Details" onClick={() => onView(certificate)} />
        <IconButton icon={<ExternalLink size={15} />} tooltip="Verify Certificate" onClick={() => onVerify(certificate)} />
        <IconButton icon={<Share2 size={15} />} tooltip="Copy Verification Link" onClick={() => onShare(certificate)} />
        {onQR && (
          <IconButton icon={<QrCode size={15} />} tooltip="Download QR Code" onClick={() => onQR(certificate)} />
        )}
        {onDownload && (
          <IconButton icon={<Download size={15} />} tooltip="Download Certificate" onClick={() => onDownload(certificate)} />
        )}
      </div>
    </div>
  );
}

function IconButton({ icon, tooltip, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 32,
          height: 32,
          borderRadius: T.RADIUS.sm,
          border: 'none',
          backgroundColor: hovered ? `${T.PRIMARY}14` : 'transparent',
          color: hovered ? T.PRIMARY : T.MUTED,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: `background-color ${T.DURATION.fast} ease, color ${T.DURATION.fast} ease`,
          padding: 0,
        }}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
