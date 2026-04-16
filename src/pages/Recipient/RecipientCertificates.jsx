import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { RecipientLayout } from '../../components/recipient/RecipientLayout';
import { CertificateCard } from '../../components/ui/CertificateCard';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import {
  fetchRecipientCertificates,
  fetchCertificateDetail,
  fetchRecipientOrgs,
} from '../../features/recipientCertificates/recipientCertificatesThunks';
import {
  setPage,
  setSearch,
  setStatusFilter,
  setOrgFilter,
  clearSelectedCert,
} from '../../features/recipientCertificates/recipientCertificatesSlice';
import {
  selectCertificates,
  selectCertificatesTotal,
  selectCertificatesPage,
  selectCertificatesLimit,
  selectCertificatesSearch,
  selectCertificatesStatusFilter,
  selectCertificatesLoading,
  selectSelectedCert,
} from '../../features/recipientCertificates/recipientCertificatesSelectors';
import { selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';
import { useToast } from '../../hooks/useToast';
import { copyToClipboard } from '../../utils/clipboard';
import RecipientCertificateDetail from './RecipientCertificateDetail';
import * as T from '../../styles/tokens';

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Revoked', value: 'revoked' },
];

function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: T.WHITE,
      borderRadius: T.RADIUS.lg,
      border: `1px solid ${T.BORDER}`,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 56, height: 20, borderRadius: T.RADIUS.full, background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: T.RADIUS.sm, background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ width: '80%', height: 16, borderRadius: T.RADIUS.sm, background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ width: '60%', height: 13, borderRadius: T.RADIUS.sm, background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ width: '45%', height: 12, borderRadius: T.RADIUS.sm, background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: T.RADIUS.sm, background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        ))}
      </div>
    </div>
  );
}

export default function RecipientCertificates() {
  const dispatch = useDispatch();
  const toast = useToast();
  const token = useSelector(selectRecipientToken);
  const certificates = useSelector(selectCertificates);
  const total = useSelector(selectCertificatesTotal);
  const page = useSelector(selectCertificatesPage);
  const limit = useSelector(selectCertificatesLimit);
  const search = useSelector(selectCertificatesSearch);
  const statusFilter = useSelector(selectCertificatesStatusFilter);
  const loading = useSelector(selectCertificatesLoading);
  const selectedCert = useSelector(selectSelectedCert);
  const orgList = useSelector(state => state.recipientCertificates.orgList);
  const orgFilter = useSelector(state => state.recipientCertificates.orgFilter);

  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef(null);

  useEffect(() => {
    dispatch(fetchRecipientOrgs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRecipientCertificates());
  }, [dispatch, page, statusFilter, orgFilter]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setSearch(localSearch));
      dispatch(fetchRecipientCertificates());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [localSearch, dispatch]);

  function handleView(cert) {
    dispatch(fetchCertificateDetail(cert.certificate_id));
  }

  function handleVerify(cert) {
    window.open(`/verify/${cert.cert_hash}`, '_blank');
  }

  function handleShare(cert) {
    copyToClipboard(`${window.location.origin}/verify/${cert.cert_hash}`, () => toast.success('Verification link copied!'));
  }

  function handleStatusTab(value) {
    dispatch(setStatusFilter(value));
  }

  function handleOrgTab(value) {
    dispatch(setOrgFilter(value));
  }

  const totalPages = Math.ceil(total / limit);
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <RecipientLayout title="My Certificates" subtitle={`${total} certificate${total !== 1 ? 's' : ''} issued to you`}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {orgList.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: T.SPACING.sm, flexWrap: 'wrap' }}>
          {[{ label: 'All Orgs', value: '' }, ...orgList.map(o => ({ label: o.org_name, value: o.org_id }))].map(tab => (
            <button
              key={tab.value}
              onClick={() => handleOrgTab(tab.value)}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: T.RADIUS.full,
                border: orgFilter === tab.value ? 'none' : `1px solid ${T.BORDER}`,
                backgroundColor: orgFilter === tab.value ? T.PRIMARY : T.WHITE,
                color: orgFilter === tab.value ? T.WHITE : T.MUTED,
                cursor: 'pointer',
                transition: `all ${T.DURATION.fast} ease`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: T.SPACING.md }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleStatusTab(tab.value)}
            style={{
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 500,
              borderRadius: T.RADIUS.full,
              border: statusFilter === tab.value ? 'none' : `1px solid ${T.BORDER}`,
              backgroundColor: statusFilter === tab.value ? T.PRIMARY : T.WHITE,
              color: statusFilter === tab.value ? T.WHITE : T.MUTED,
              cursor: 'pointer',
              transition: `all ${T.DURATION.fast} ease`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: T.SPACING.lg }}>
        <SearchBar
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Search certificates..."
          onClear={() => { setLocalSearch(''); dispatch(setSearch('')); dispatch(fetchRecipientCertificates()); }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Certificates issued to you will appear here."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {certificates.map(cert => (
            <CertificateCard
              key={cert.certificate_id}
              certificate={cert}
              onView={handleView}
              onVerify={handleVerify}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {total > limit && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: T.SPACING.lg }}>
          <span style={{ fontSize: 13, color: T.MUTED }}>
            Showing {startItem}–{endItem} of {total}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="outline"
              onClick={() => dispatch(setPage(page - 1))}
              disabled={page <= 1}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', fontSize: 13 }}
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            <Button
              variant="outline"
              onClick={() => dispatch(setPage(page + 1))}
              disabled={page >= totalPages}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', fontSize: 13 }}
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={!!selectedCert} size="xl" title="Certificate Details" onClose={() => dispatch(clearSelectedCert())}>
        <RecipientCertificateDetail
          certificateId={selectedCert?.certificate_id}
          asModal
        />
      </Modal>
    </RecipientLayout>
  );
}
