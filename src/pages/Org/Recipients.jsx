import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, Pencil, Ban, CheckCircle, UserPlus, Upload, Users, UserCheck, Clock, X } from 'lucide-react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { PageTransition } from '../../components/shared/PageTransition';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar } from '../../components/ui/FilterBar';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Loader } from '../../components/ui/Loader';
import { StatCard } from '../../components/ui/StatCard';
import { selectToken } from '../../store/auth/authSelectors';
import { selectDashboardStats } from '../../features/orgDashboard/orgDashboardSelectors';
import {
  selectRecipients, selectRecipientsTotal, selectRecipientsPage, selectRecipientsLimit,
  selectRecipientsSearch, selectRecipientsFilters, selectRecipientsLoading,
  selectSelectedRecipient, selectRecipientLoading,
  selectUpdating, selectUpdateError,
  selectInviting, selectInviteError,
} from '../../features/orgRecipients/orgRecipientsSelectors';
import {
  setPage, setSearch, setFilters, clearSelectedRecipient, clearUpdateError, clearInviteError,
} from '../../features/orgRecipients/orgRecipientsSlice';
import {
  fetchRecipients, fetchRecipientDetail, updateRecipientThunk, submitInvite, submitBulkInvite,
} from '../../features/orgRecipients/orgRecipientsThunks';
import { useToast } from '../../hooks/useToast';
import {
  PRIMARY, BORDER, TEXT, MUTED, SURFACE, WHITE,
  SPACING, RADIUS, SHADOW, DURATION,
  DANGER, SUCCESS, WARNING, TEXT_SECONDARY, SURFACE_HOVER,
} from '../../styles/tokens';
import { getAvatarColor, getInitials } from '../../utils/avatar';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';

function Avatar({ name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: RADIUS.full,
      backgroundColor: getAvatarColor(name),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: WHITE, fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
      userSelect: 'none',
    }}>
      {getInitials(name)}
    </div>
  );
}

function InviteStatusBadge({ status }) {
  if (status === 'accepted') return <Badge variant="success" size="sm">Accepted</Badge>;
  if (status === 'pending')  return <Badge variant="warning" size="sm">Pending</Badge>;
  return <Badge variant="danger" size="sm">Expired</Badge>;
}

function RecipientStatusBadge({ status }) {
  return status === 'suspended'
    ? <Badge variant="danger" size="sm">Suspended</Badge>
    : <Badge variant="success" size="sm">Active</Badge>;
}

function InviteModal({ isOpen, onClose, token, onSuccess }) {
  const dispatch = useDispatch();
  const inviting = useSelector(selectInviting);
  const inviteError = useSelector(selectInviteError);
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');

  useEffect(() => {
    if (!isOpen) { setEmail(''); setEmailErr(''); dispatch(clearInviteError()); }
  }, [isOpen, dispatch]);

  async function handleSubmit() {
    if (!email.trim()) { setEmailErr('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr('Enter a valid email.'); return; }
    const result = await dispatch(submitInvite({ token, email: email.trim().toLowerCase() }));
    if (!result.error) { onSuccess(); onClose(); }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Recipient" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
          error={emailErr}
          placeholder="recipient@example.com"
        />
        {inviteError && (
          <p style={{ color: DANGER, fontSize: 13, padding: '8px 12px', backgroundColor: `${DANGER}0d`, borderRadius: RADIUS.sm }}>
            {inviteError}
          </p>
        )}
        <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose} disabled={inviting}>Cancel</Button>
          <Button loading={inviting} onClick={handleSubmit}>Send Invite</Button>
        </div>
      </div>
    </Modal>
  );
}

function BulkInviteModal({ isOpen, onClose, token, onSuccess }) {
  const dispatch = useDispatch();
  const inviting = useSelector(selectInviting);
  const [step, setStep] = useState(1);
  const [emails, setEmails] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isOpen) { setStep(1); setEmails([]); setTextInput(''); setResult(null); }
  }, [isOpen]);

  function parseEmails(raw) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return [...new Set(
      raw.split(/[\n,;]+/).map(e => e.trim().toLowerCase()).filter(e => EMAIL_RE.test(e))
    )];
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const parsed = parseEmails(ev.target.result);
      setEmails(parsed);
      setStep(2);
    };
    reader.readAsText(file);
  }

  function handleTextParse() {
    const parsed = parseEmails(textInput);
    setEmails(parsed);
    setStep(2);
  }

  async function handleConfirm() {
    const invites = emails.map(email => ({ email }));
    const res = await dispatch(submitBulkInvite({ token, invites }));
    if (!res.error) {
      setResult(res.payload);
      setStep(3);
      setTimeout(() => { onSuccess(); onClose(); }, 2500);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Invite Recipients" size="md">
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
          <p style={{ fontSize: 14, color: MUTED }}>Upload a CSV (one email per row) or paste emails below.</p>
          <div style={{ display: 'flex', gap: SPACING.sm }}>
            <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={handleFile} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload size={14} /> Upload CSV</Button>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: TEXT, display: 'block', marginBottom: 6 }}>
              Or paste emails (one per line)
            </label>
            <textarea
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              rows={6}
              placeholder="alice@example.com&#10;bob@example.com"
              style={{
                width: '100%', borderRadius: RADIUS.md, border: `1px solid ${BORDER}`,
                padding: '10px 12px', fontSize: 13, resize: 'vertical',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button disabled={!textInput.trim()} onClick={handleTextParse}>Preview</Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
          <p style={{ fontSize: 14, color: TEXT }}>
            This will send <strong>{emails.length}</strong> invite email{emails.length !== 1 ? 's' : ''}.
          </p>
          <div style={{
            border: `1px solid ${BORDER}`, borderRadius: RADIUS.md,
            maxHeight: 220, overflowY: 'auto', padding: '8px 12px',
          }}>
            {emails.slice(0, 10).map(e => (
              <div key={e} style={{ fontSize: 13, padding: '4px 0', borderBottom: `1px solid ${BORDER}`, color: TEXT }}>{e}</div>
            ))}
            {emails.length > 10 && (
              <div style={{ fontSize: 12, color: MUTED, padding: '6px 0' }}>+{emails.length - 10} more</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setStep(1)} disabled={inviting}>Back</Button>
            <Button loading={inviting} onClick={handleConfirm}>Send {emails.length} Invite{emails.length !== 1 ? 's' : ''}</Button>
          </div>
        </div>
      )}
      {step === 3 && result && (
        <div style={{ textAlign: 'center', padding: SPACING.xl }}>
          <CheckCircle size={40} color={SUCCESS} />
          <p style={{ fontSize: 16, fontWeight: 600, color: TEXT, marginTop: SPACING.md }}>
            {result.sent} invite{result.sent !== 1 ? 's' : ''} sent successfully.
          </p>
          {result.failed?.length > 0 && (
            <p style={{ fontSize: 13, color: DANGER, marginTop: SPACING.sm }}>
              {result.failed.length} failed.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

function NotesEditor({ recipientId, initialNotes, token, onClose }) {
  const dispatch = useDispatch();
  const updating = useSelector(selectUpdating);
  const updateError = useSelector(selectUpdateError);
  const [text, setText] = useState(initialNotes ?? '');

  async function handleSave() {
    const result = await dispatch(updateRecipientThunk({ token, id: recipientId, data: { notes: text } }));
    if (!result.error) onClose();
  }

  return (
    <div style={{ marginTop: SPACING.sm }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={4}
        maxLength={500}
        style={{
          width: '100%', borderRadius: RADIUS.md, border: `1px solid ${BORDER}`,
          padding: '10px 12px', fontSize: 13, resize: 'vertical',
          fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />
      {updateError && <p style={{ color: DANGER, fontSize: 12, marginTop: 4 }}>{updateError}</p>}
      <div style={{ display: 'flex', gap: SPACING.xs, marginTop: SPACING.sm }}>
        <Button loading={updating} onClick={handleSave} style={{ fontSize: 13 }}>Save</Button>
        <Button variant="ghost" onClick={onClose} disabled={updating} style={{ fontSize: 13 }}>Cancel</Button>
      </div>
    </div>
  );
}

function DetailPanel({ recipient, token, onClose, onSuspendRequest }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectRecipientLoading);
  const updating = useSelector(selectUpdating);
  const [editingNotes, setEditingNotes] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setEditingNotes(false);
    dispatch(clearUpdateError());
  }, [recipient?.recipient_id, dispatch]);

  if (!recipient && !loading) return null;

  async function handleReactivate() {
    const result = await dispatch(updateRecipientThunk({
      token,
      id: recipient.recipient_id,
      data: { status: 'active' },
    }));
    if (!result.error) toast.success('Recipient reactivated.');
    else toast.error('Failed to reactivate.');
  }

  async function confirmSuspend() {
    const result = await dispatch(updateRecipientThunk({
      token,
      id: recipient.recipient_id,
      data: { status: 'suspended' },
    }));
    if (!result.error) { setSuspendOpen(false); toast.success('Recipient suspended.'); }
    else toast.error('Failed to suspend.');
  }

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: SPACING.sm }}>
      {children}
    </div>
  );

  const MetaRow = ({ label, children }) => (
    <div style={{ display: 'flex', gap: SPACING.md, padding: `${SPACING.xs}px 0`, borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontSize: 13, color: MUTED, minWidth: 130, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: TEXT }}>{children}</span>
    </div>
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 40, transition: `opacity ${DURATION.normal}`,
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        backgroundColor: WHITE, zIndex: 50, boxShadow: SHADOW.xl,
        display: 'flex', flexDirection: 'column',
        transform: 'translateX(0)',
        transition: `transform 250ms ease-out`,
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: SPACING.md,
          padding: SPACING.lg, borderBottom: `1px solid ${BORDER}`,
          position: 'sticky', top: 0, backgroundColor: WHITE, zIndex: 1,
        }}>
          {recipient && <Avatar name={recipient.name} size={64} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? <Loader size="sm" /> : (
              <>
                <div style={{ fontWeight: 700, fontSize: 16, color: TEXT, marginBottom: 2 }}>{recipient?.name}</div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>{recipient?.email}</div>
                {recipient && <RecipientStatusBadge status={recipient.status} />}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, borderRadius: RADIUS.sm }}
          >
            <X size={18} />
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.xl }}>
            <Loader />
          </div>
        )}

        {!loading && recipient && (
          <div style={{ padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.lg, flex: 1 }}>
            <div>
              <SectionLabel>Details</SectionLabel>
              <MetaRow label="Invite Status"><InviteStatusBadge status={recipient.invite_status} /></MetaRow>
              <MetaRow label="Member Since">{new Date(recipient.created_at).toLocaleDateString()}</MetaRow>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                <SectionLabel>Notes</SectionLabel>
                {!editingNotes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: PRIMARY, fontSize: 12, fontWeight: 600 }}
                  >
                    {recipient.notes ? 'Edit' : 'Add note'}
                  </button>
                )}
              </div>
              {editingNotes ? (
                <NotesEditor
                  recipientId={recipient.recipient_id}
                  initialNotes={recipient.notes}
                  token={token}
                  onClose={() => setEditingNotes(false)}
                />
              ) : (
                recipient.notes
                  ? <p style={{ fontSize: 13, color: TEXT, whiteSpace: 'pre-wrap', margin: 0 }}>{recipient.notes}</p>
                  : <p style={{ fontSize: 13, color: MUTED, fontStyle: 'italic', margin: 0 }}>No notes</p>
              )}
            </div>

            <div>
              <SectionLabel>Certificates ({recipient.certificates?.length ?? 0})</SectionLabel>
              {recipient.certificates?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 280, overflowY: 'auto' }}>
                  {recipient.certificates.map(c => (
                    <div
                      key={c.certificate_id}
                      onClick={() => navigate(`/org/certificate/${c.certificate_id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: `${SPACING.sm}px ${SPACING.md}px`,
                        borderRadius: RADIUS.md, cursor: 'pointer',
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = SURFACE_HOVER}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{c.course}</div>
                        <div style={{ fontSize: 11, color: MUTED }}>{new Date(c.issued_at).toLocaleDateString()}</div>
                      </div>
                      {c.is_revoked
                        ? <Badge variant="danger" size="sm">Revoked</Badge>
                        : <Badge variant="success" size="sm">Active</Badge>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: MUTED, fontStyle: 'italic', margin: 0 }}>No certificates issued yet.</p>
              )}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
              {recipient.status === 'active' ? (
                <Button
                  variant="outline"
                  style={{ fontSize: 13, color: DANGER, borderColor: DANGER, width: '100%' }}
                  onClick={() => setSuspendOpen(true)}
                >
                  <Ban size={14} /> Suspend Recipient
                </Button>
              ) : (
                <Button
                  variant="outline"
                  loading={updating}
                  style={{ fontSize: 13, color: SUCCESS, borderColor: SUCCESS, width: '100%' }}
                  onClick={handleReactivate}
                >
                  <CheckCircle size={14} /> Reactivate
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={suspendOpen}
        title="Suspend Recipient"
        message="This recipient will no longer be able to log in. Their existing certificates remain valid. You can reactivate them at any time."
        confirmLabel="Suspend"
        confirmVariant="danger"
        loading={updating}
        onConfirm={confirmSuspend}
        onCancel={() => setSuspendOpen(false)}
      />
    </>
  );
}

function RecipientInfoModal({ recipient, onClose }) {
  if (!recipient) return null;
  return (
    <Modal isOpen={!!recipient} onClose={onClose} title="Recipient Info" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
          <Avatar name={recipient.name} size={48} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: TEXT }}>{recipient.name}</div>
            <div style={{ fontSize: 13, color: MUTED }}>{recipient.email}</div>
            <div style={{ marginTop: 6 }}>
              {recipient.invite_accepted
                ? <Badge variant="success" size="sm">Active</Badge>
                : <Badge variant="warning" size="sm">Pending</Badge>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            ['Certificates issued', recipient.certificate_count ?? recipient.cert_count ?? 0],
            ['Last login', recipient.last_login_at ? formatRelativeTime(recipient.last_login_at) : 'Never'],
            ['Member since', formatDate(recipient.created_at)],
            ['Account status', recipient.status === 'suspended' ? 'Suspended' : 'Active'],
            ['Invite status', recipient.invite_status ?? '—'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: `${SPACING.xs}px 0`, borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13, color: MUTED }}>{label}</span>
              <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>{String(value)}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: SPACING.xs }}>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function Recipients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const toast = useToast();
  const stats = useSelector(selectDashboardStats);
  const [searchParams, setSearchParams] = useSearchParams();

  const recipients = useSelector(selectRecipients);
  const total = useSelector(selectRecipientsTotal);
  const page = useSelector(selectRecipientsPage);
  const limit = useSelector(selectRecipientsLimit);
  const search = useSelector(selectRecipientsSearch);
  const filters = useSelector(selectRecipientsFilters);

  const [infoRow, setInfoRow] = useState(null);
  const loading = useSelector(selectRecipientsLoading);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'invite') {
      setInviteOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const load = useCallback(() => {
    dispatch(fetchRecipients({ token, page, limit, search, filters }));
  }, [dispatch, token, page, limit, search, filters]);

  useEffect(() => { load(); }, [load]);

  function openDetail(r) {
    dispatch(fetchRecipientDetail({ token, recipientId: r.recipient_id }));
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    dispatch(clearSelectedRecipient());
  }

  async function handleSuspendRow(r) {
    const result = await dispatch(updateRecipientThunk({ token, id: r.recipient_id, data: { status: 'suspended' } }));
    if (!result.error) toast.success('Recipient suspended.');
    else toast.error('Failed.');
  }

  async function handleUnsuspendRow(r) {
    const result = await dispatch(updateRecipientThunk({ token, id: r.recipient_id, data: { status: 'active' } }));
    if (!result.error) toast.success('Recipient reactivated.');
    else toast.error('Failed.');
  }

  const FILTER_DEFS = [
    { key: 'status', label: 'Status', options: [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'invite_pending', label: 'Invite Pending' },
    ]},
  ];

  const iconBtn = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: MUTED, padding: 4, borderRadius: RADIUS.sm,
    display: 'inline-flex', alignItems: 'center',
    transition: `color ${DURATION.fast}`,
  };

  const TABLE_COLUMNS = [
    { key: 'avatar', label: '', render: r => <Avatar name={r.name} size={32} /> },
    { key: 'name', label: 'Name', render: r => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
        <div style={{ fontSize: 12, color: MUTED }}>{r.email}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: r => <RecipientStatusBadge status={r.status} /> },
    { key: 'cert_count', label: 'Certs', render: r => (
      <span style={{ fontSize: 13, fontWeight: 600, color: PRIMARY }}>{r.cert_count ?? 0}</span>
    )},
    { key: 'invite_accepted', label: 'Account', render: r => (
      r.invite_accepted
        ? <Badge variant="success" size="sm">Active</Badge>
        : <Badge variant="warning" size="sm">Pending</Badge>
    )},
    { key: 'invite_status', label: 'Invite', render: r => <InviteStatusBadge status={r.invite_status} /> },
    { key: 'last_login_at', label: 'Last Login', render: r => (
      <span style={{ fontSize: 13, color: MUTED }}>
        {r.last_login_at ? formatRelativeTime(r.last_login_at) : 'Never'}
      </span>
    )},
    { key: 'actions', label: '', render: r => (
      <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
        <button title="View" onClick={() => openDetail(r)} style={iconBtn}><Eye size={15} /></button>
        <button title="Edit Notes" onClick={() => openDetail(r)} style={iconBtn}><Pencil size={15} /></button>
        {r.status === 'active'
          ? <button title="Suspend" onClick={() => handleSuspendRow(r)} style={{ ...iconBtn, color: DANGER }}><Ban size={15} /></button>
          : <button title="Reactivate" onClick={() => handleUnsuspendRow(r)} style={{ ...iconBtn, color: SUCCESS }}><CheckCircle size={15} /></button>
        }
      </div>
    )},
  ];

  const selectedRecipient = useSelector(s => s.orgRecipients.selectedRecipient);

  return (
    <OrgLayout>
      <PageTransition>
      <PageHeader
        title="Recipients"
        subtitle="Manage your certificate recipients"
        actions={[
          { label: 'Invite Recipient', onClick: () => setInviteOpen(true), icon: UserPlus },
          { label: 'Bulk Invite', onClick: () => setBulkOpen(true), icon: Upload, variant: 'outline' },
        ]}
      />

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SPACING.md, marginBottom: SPACING.lg }}>
          <StatCard title="Total Recipients" value={stats.total_recipients ?? 0} icon={Users} color={PRIMARY} />
          <StatCard title="Active" value={(stats.total_recipients ?? 0) - (stats.suspended_recipients ?? 0)} icon={UserCheck} color={SUCCESS} />
          <StatCard title="Pending Invites" value={stats.pendingInvites ?? 0} icon={Clock} color={WARNING} />
        </div>
      )}

      <div style={{ display: 'flex', gap: SPACING.md, alignItems: 'flex-end', marginBottom: SPACING.md, flexWrap: 'nowrap' }}>
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6 }}>Search</label>
          <SearchBar
            value={search}
            onChange={v => dispatch(setSearch(v))}
            placeholder="Search by name or email…"
            style={{ flex: 1, minWidth: 220 }}
          />
        </div>
        <FilterBar
          filters={FILTER_DEFS}
          values={{ status: filters.status }}
          onChange={(key, value) => dispatch(setFilters({ [key]: value }))}
          onReset={() => dispatch(setFilters({ status: '' }))}
        />
      </div>

      {!loading && recipients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No recipients yet"
          description="Invite your first recipient to get started"
          action={{ label: 'Invite Recipient', onClick: () => setInviteOpen(true) }}
        />
      ) : (
        <Table
          columns={TABLE_COLUMNS}
          data={recipients}
          total={total}
          page={page}
          limit={limit}
          onPageChange={p => dispatch(setPage(p))}
          loading={loading}
          onRowClick={r => setInfoRow(r)}
        />
      )}

      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        token={token}
        onSuccess={() => { toast.success('Invite sent.'); load(); }}
      />

      <BulkInviteModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        token={token}
        onSuccess={() => { toast.success('Bulk invites sent.'); load(); }}
      />

      <RecipientInfoModal recipient={infoRow} onClose={() => setInfoRow(null)} />

      {panelOpen && (
        <DetailPanel
          recipient={selectedRecipient}
          token={token}
          onClose={closePanel}
        />
      )}
      </PageTransition>
    </OrgLayout>
  );
}
