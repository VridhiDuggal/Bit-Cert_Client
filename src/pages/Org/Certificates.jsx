import { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Eye, Send, XCircle, PlusCircle, Upload, FileText, Copy, Download, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
import { selectToken } from '../../store/auth/authSelectors';
import {
  selectIssueCertificates, selectIssueTotal, selectIssuePage, selectIssueLimit,
  selectIssueSearch, selectIssueFilters, selectIssueLoading,
  selectIssuing, selectIssueError2,
  selectSelectedCert, selectDetailLoading,
  selectRevoking, selectRevokeError,
  selectVerificationHistory, selectVhLoading, selectVhTotal, selectVhPage,
  selectResending,
  selectRecipientResults, selectRecipientSearchLoading,
} from '../../features/orgIssue/orgIssueSelectors';
import {
  setPage, setSearch, setFilters, resetFilters, setVhPage,
  clearSelectedCert, clearIssueError, clearRevokeError, clearRecipientResults,
} from '../../features/orgIssue/orgIssueSlice';
import {
  fetchIssueCertificates, submitIssueCertificate,
  fetchCertificateDetail, submitRevokeCertificate,
  fetchVerificationHistory, submitResendCertificate,
  fetchRecipientSearch,
} from '../../features/orgIssue/orgIssueThunks';
import { useToast } from '../../hooks/useToast';
import {
  PRIMARY, BORDER, TEXT, MUTED, SURFACE,
  SPACING, RADIUS, SHADOW, DURATION,
  DANGER, INFO, WHITE, TEXT_SECONDARY,
} from '../../styles/tokens';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ expiry_date }) {
  if (!expiry_date) return <span style={{ color: MUTED, fontSize: 13 }}>—</span>;
  const days = daysUntil(expiry_date);
  if (days < 0) return <Badge variant="danger" size="sm">Expired</Badge>;
  if (days <= 30) return <Badge variant="warning" size="sm">{days}d left</Badge>;
  return <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{new Date(expiry_date).toLocaleDateString()}</span>;
}

function TagList({ tags, max = 3 }) {
  if (!tags || !tags.length) return null;
  const shown = tags.slice(0, max);
  const rest = tags.length - max;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {shown.map(t => <Badge key={t} variant="neutral" size="sm">{t}</Badge>)}
      {rest > 0 && <span style={{ fontSize: 11, color: MUTED, alignSelf: 'center' }}>+{rest}</span>}
    </div>
  );
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  function addTag(val) {
    const trimmed = val.trim().slice(0, 30);
    if (!trimmed || tags.includes(trimmed) || tags.length >= 5) return;
    onChange([...tags, trimmed]);
    setInput('');
  }

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>
        Tags <span style={{ color: MUTED, fontWeight: 400 }}>(optional, max 5)</span>
      </label>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
        border: `1px solid ${BORDER}`, borderRadius: RADIUS.md, padding: '8px 12px',
        minHeight: 42, backgroundColor: WHITE,
      }}>
        {tags.map(t => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            backgroundColor: `${PRIMARY}1a`, color: PRIMARY,
            borderRadius: RADIUS.full, padding: '2px 10px', fontSize: 12, fontWeight: 600,
          }}>
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter(x => x !== t))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: PRIMARY, padding: 0, lineHeight: 1, fontSize: 14 }}
            >×</button>
          </span>
        ))}
        {tags.length < 5 && (
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onBlur={() => addTag(input)}
            placeholder={tags.length ? '' : 'Type and press Enter…'}
            style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, minWidth: 120, backgroundColor: 'transparent' }}
          />
        )}
      </div>
    </div>
  );
}

function RecipientSearch({ value, onSelect, token }) {
  const dispatch = useDispatch();
  const results = useSelector(selectRecipientResults);
  const loading = useSelector(selectRecipientSearchLoading);
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  function triggerSearch(q) {
    clearTimeout(debounceRef.current);
    if (!q.trim()) { dispatch(clearRecipientResults()); setOpen(false); return; }
    debounceRef.current = setTimeout(() => {
      dispatch(fetchRecipientSearch({ token, query: q }));
      setOpen(true);
    }, 300);
  }

  function handleChange(e) {
    setQuery(e.target.value);
    onSelect({ name: e.target.value, recipient_id: null });
    triggerSearch(e.target.value);
  }

  function pick(r) {
    setQuery(r.name);
    onSelect({ name: r.name, recipient_id: r.recipient_id, email: r.email });
    setOpen(false);
    dispatch(clearRecipientResults());
  }

  return (
    <div style={{ position: 'relative' }}>
      <Input
        label="Recipient"
        value={query}
        onChange={handleChange}
        onFocus={() => query && results.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search by name or email"
      />
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          backgroundColor: WHITE, border: `1px solid ${BORDER}`,
          borderRadius: RADIUS.md, boxShadow: SHADOW.md, maxHeight: 200, overflowY: 'auto', marginTop: 2,
        }}>
          {loading && <div style={{ padding: '8px 12px', color: MUTED, fontSize: 13 }}><Loader size="sm" /></div>}
          {!loading && results.length === 0 && (
            <div style={{ padding: '10px 14px', fontSize: 13, color: MUTED }}>No match — invite will be sent automatically</div>
          )}
          {results.map(r => (
            <div
              key={r.recipient_id}
              onMouseDown={() => pick(r)}
              style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, borderBottom: `1px solid ${BORDER}` }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = SURFACE}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = WHITE}
            >
              <strong>{r.name}</strong>
              <span style={{ color: MUTED, marginLeft: 8 }}>{r.email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IssueModal({ isOpen, onClose, token, onSuccess }) {
  const dispatch = useDispatch();
  const issuing = useSelector(selectIssuing);
  const issueError = useSelector(selectIssueError2);
  const today = new Date().toISOString().slice(0, 10);

  const blank = useCallback(() => ({
    recipient_name: '', recipient_id: null, recipient_email: '',
    course: '', description: '', issue_date: today, expiry_date: '', tags: [],
  }), [today]);

  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) { setForm(blank()); setErrors({}); dispatch(clearIssueError()); }
  }, [isOpen, dispatch, blank]);

  function validate() {
    const e = {};
    if (!form.recipient_name.trim()) e.recipient_name = 'Recipient name is required.';
    if (!form.recipient_id && !form.recipient_email?.trim()) e.recipient_name = e.recipient_name || 'Please select a recipient or enter email.';
    if (!form.course.trim()) e.course = 'Course title is required.';
    if (!form.issue_date) e.issue_date = 'Issue date is required.';
    if (form.expiry_date && new Date(form.expiry_date) <= new Date(form.issue_date)) {
      e.expiry_date = 'Expiry date must be after issue date.';
    }
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const data = {
      recipient_name: form.recipient_name,
      course: form.course,
      issue_date: form.issue_date,
    };
    if (form.description?.trim()) data.description = form.description;
    if (form.expiry_date) data.expiry_date = form.expiry_date;
    if (form.tags?.length) data.tags = form.tags;
    if (form.recipient_id) data.recipient_id = form.recipient_id;
    else if (form.recipient_email?.trim()) data.recipient_email = form.recipient_email;
    const result = await dispatch(submitIssueCertificate({ token, data }));
    if (!result.error) { onSuccess(); onClose(); }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Certificate" size="lg" isDirty={form.course.length > 0}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        <RecipientSearch
          value={form.recipient_name}
          token={token}
          onSelect={({ name, recipient_id, email }) => {
            setForm(f => ({ ...f, recipient_name: name, recipient_id: recipient_id ?? null, recipient_email: email ?? '' }));
            if (errors.recipient_name) setErrors(er => ({ ...er, recipient_name: undefined }));
          }}
        />
        {errors.recipient_name && <span style={{ color: DANGER, fontSize: 12 }}>{errors.recipient_name}</span>}
        <Input
          label="Course / Achievement Title"
          value={form.course}
          onChange={e => { set('course', e.target.value); setErrors(er => ({ ...er, course: undefined })); }}
          error={errors.course}
        />
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}>
            Description <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            style={{
              width: '100%', borderRadius: RADIUS.md, border: `1px solid ${BORDER}`,
              padding: '10px 12px', fontSize: 14, resize: 'vertical',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.md }}>
          <Input
            label="Issue Date"
            type="date"
            value={form.issue_date}
            onChange={e => { set('issue_date', e.target.value); setErrors(er => ({ ...er, issue_date: undefined })); }}
            error={errors.issue_date}
          />
          <Input
            label="Expiry Date (optional)"
            type="date"
            value={form.expiry_date}
            onChange={e => { set('expiry_date', e.target.value); setErrors(er => ({ ...er, expiry_date: undefined })); }}
            error={errors.expiry_date}
          />
        </div>
        <TagInput tags={form.tags} onChange={v => set('tags', v)} />
        {issueError && (
          <p style={{ color: DANGER, fontSize: 13, padding: '8px 12px', backgroundColor: `${DANGER}0d`, borderRadius: RADIUS.sm }}>
            {issueError}
          </p>
        )}
        <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end', marginTop: SPACING.sm }}>
          <Button variant="ghost" onClick={onClose} disabled={issuing}>Cancel</Button>
          <Button loading={issuing} onClick={handleSubmit}>Issue Certificate</Button>
        </div>
      </div>
    </Modal>
  );
}

function DetailModal({ isOpen, onClose, cert, token, onRevokeRequest }) {
  const dispatch = useDispatch();
  const detailLoading = useSelector(selectDetailLoading);
  const vhData = useSelector(selectVerificationHistory);
  const vhLoading = useSelector(selectVhLoading);
  const vhTotal = useSelector(selectVhTotal);
  const vhPage = useSelector(selectVhPage);
  const resending = useSelector(selectResending);
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) { setTab('overview'); setCopied(false); }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && tab === 'history' && cert) {
      dispatch(fetchVerificationHistory({ token, certId: cert.certificate_id, page: vhPage }));
    }
  }, [isOpen, tab, vhPage, cert, dispatch, token]);

  if (!isOpen || !cert) return null;

  const verificationUrl = `${API_BASE}/api/verify/${cert.cert_hash}`;

  function copyLink() {
    navigator.clipboard.writeText(verificationUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleResend() {
    const result = await dispatch(submitResendCertificate({ token, certId: cert.certificate_id }));
    if (!result.error) toast.success('Certificate email resent.');
    else toast.error(result.payload ?? 'Failed to resend.');
  }

  const tabStyle = (active) => ({
    fontSize: 14, fontWeight: 600, padding: `${SPACING.sm}px ${SPACING.md}px`,
    border: 'none', cursor: 'pointer',
    borderBottom: active ? `2px solid ${PRIMARY}` : '2px solid transparent',
    color: active ? PRIMARY : MUTED, backgroundColor: 'transparent',
    transition: `color ${DURATION.fast}, border-color ${DURATION.fast}`,
  });

  function MetaRow({ label, children }) {
    return (
      <div style={{ display: 'flex', gap: SPACING.md, padding: `${SPACING.sm}px 0`, borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 13, color: MUTED, minWidth: 140, flexShrink: 0 }}>{label}</span>
        <span style={{ fontSize: 13, color: TEXT }}>{children}</span>
      </div>
    );
  }

  const VH_COLUMNS = [
    { key: 'verified_at', label: 'Timestamp', render: r => new Date(r.verified_at).toLocaleString() },
    { key: 'verifier_ip', label: 'IP Address' },
    { key: 'result', label: 'Result', render: r => r.result
      ? <Badge variant="success" size="sm">Valid</Badge>
      : <Badge variant="danger" size="sm">Invalid</Badge>
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Certificate Details" size="lg">
      {detailLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.xl }}><Loader /></div>
      ) : (
        <>
          <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: SPACING.lg }}>
            <button style={tabStyle(tab === 'overview')} onClick={() => setTab('overview')}>Overview</button>
            <button style={tabStyle(tab === 'history')} onClick={() => setTab('history')}>Verification History</button>
          </div>

          {tab === 'overview' && (
            <div>
              <div style={{ marginBottom: SPACING.lg }}>
                <MetaRow label="Recipient">
                  {cert.recipient_name} <span style={{ color: MUTED }}>({cert.recipient?.email})</span>
                </MetaRow>
                <MetaRow label="Course">{cert.course}</MetaRow>
                {cert.description && <MetaRow label="Description">{cert.description}</MetaRow>}
                <MetaRow label="Issue Date">{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '—'}</MetaRow>
                <MetaRow label="Expiry Date"><ExpiryBadge expiry_date={cert.expiry_date} /></MetaRow>
                {cert.tags?.length > 0 && <MetaRow label="Tags"><TagList tags={cert.tags} max={10} /></MetaRow>}
                <MetaRow label="Status">
                  {cert.is_revoked ? <Badge variant="danger">Revoked</Badge> : <Badge variant="success">Active</Badge>}
                </MetaRow>
                <MetaRow label="Verifications">{cert.verification_count ?? 0}</MetaRow>
                <MetaRow label="Blockchain TX">
                  <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {cert.blockchain_tx_id?.slice(0, 24)}…
                  </span>
                </MetaRow>
              </div>

              <div style={{ display: 'flex', gap: SPACING.lg, marginBottom: SPACING.lg }}>
                <QRCodeSVG value={verificationUrl} size={120} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm, justifyContent: 'center' }}>
                  <Button variant="outline" style={{ fontSize: 13 }} onClick={copyLink}>
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Verification Link'}
                  </Button>
                  <Button variant="outline" style={{ fontSize: 13 }}
                    onClick={() => window.open(`${API_BASE}/${cert.file_path}`, '_blank')}>
                    <Download size={14} /> Download PDF
                  </Button>
                  <Button variant="outline" style={{ fontSize: 13 }} loading={resending} onClick={handleResend}>
                    <Send size={14} /> Resend Email
                  </Button>
                  {!cert.is_revoked && (
                    <Button
                      style={{ fontSize: 13, backgroundColor: DANGER, color: '#fff', border: 'none' }}
                      onClick={() => { onClose(); onRevokeRequest(cert); }}
                    >
                      <XCircle size={14} /> Revoke
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div>
              {vhLoading && <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.xl }}><Loader /></div>}
              {!vhLoading && vhData.length === 0 && (
                <EmptyState
                  icon={Eye}
                  title="No verifications yet"
                  description="This certificate has not been verified publicly yet."
                />
              )}
              {!vhLoading && vhData.length > 0 && (
                <Table
                  columns={VH_COLUMNS}
                  data={vhData}
                  total={vhTotal}
                  page={vhPage}
                  limit={20}
                  onPageChange={p => dispatch(setVhPage(p))}
                  loading={vhLoading}
                />
              )}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

function BulkIssueModal({ isOpen, onClose, token, onSuccess }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const fileRef = useRef(null);
  const REQUIRED_COLS = ['recipient_name', 'recipient_email', 'course', 'issue_date'];

  useEffect(() => {
    if (!isOpen) { setStep(1); setRows([]); setProgress(0); setRunning(false); }
  }, [isOpen]);

  function parseCSV(text) {
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return lines.slice(1).map((line, i) => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};
      headers.forEach((h, idx) => { row[h] = vals[idx] ?? ''; });
      const errs = [];
      REQUIRED_COLS.forEach(c => { if (!row[c]) errs.push(`${c} required`); });
      if (row.expiry_date && row.issue_date && new Date(row.expiry_date) <= new Date(row.issue_date)) {
        errs.push('expiry must be after issue_date');
      }
      return { ...row, _idx: i + 1, _errors: errs, _valid: errs.length === 0 };
    });
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setRows(parseCSV(ev.target.result));
    reader.readAsText(file);
    setStep(2);
  }

  async function runBulk() {
    setRunning(true);
    const valid = rows.filter(r => r._valid);
    let done = 0;
    for (const r of valid) {
      const data = {
        recipient_name: r.recipient_name,
        recipient_email: r.recipient_email,
        course: r.course,
        issue_date: r.issue_date,
        description: r.description || undefined,
        expiry_date: r.expiry_date || undefined,
        tags: r.tags ? r.tags.split(';').map(t => t.trim()).filter(Boolean) : undefined,
      };
      await dispatch(submitIssueCertificate({ token, data }));
      done++;
      setProgress(done);
    }
    setRunning(false);
    setStep(3);
    setTimeout(() => { onSuccess(); onClose(); }, 1800);
  }

  const valid = rows.filter(r => r._valid);
  const invalid = rows.filter(r => !r._valid);
  const cellStyle = { fontSize: 12, padding: '6px 10px', borderBottom: `1px solid ${BORDER}` };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Issue Certificates" size="lg">
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, alignItems: 'center', padding: SPACING.xl }}>
          <FileText size={40} color={PRIMARY} />
          <p style={{ fontSize: 14, color: TEXT, textAlign: 'center', maxWidth: 360 }}>
            Upload a CSV. Required columns: <strong>recipient_name, recipient_email, course, issue_date</strong> (YYYY-MM-DD).
            Optional: description, tags (semicolon-separated), expiry_date.
          </p>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFile} />
          <Button onClick={() => fileRef.current?.click()}><Upload size={14} /> Choose CSV</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: SPACING.md }}>
            {valid.length} valid row{valid.length !== 1 ? 's' : ''} — {invalid.length} with errors
          </p>
          <div style={{ overflowX: 'auto', maxHeight: 300, overflowY: 'auto', border: `1px solid ${BORDER}`, borderRadius: RADIUS.md }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead style={{ backgroundColor: SURFACE, position: 'sticky', top: 0 }}>
                <tr>
                  {['#', 'Name', 'Email', 'Course', 'Issue Date', 'Expiry', 'Tags', 'Status'].map(h => (
                    <th key={h} style={{ ...cellStyle, fontWeight: 600, color: TEXT, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r._idx} style={{ backgroundColor: r._valid ? WHITE : `${DANGER}0a` }}>
                    <td style={cellStyle}>{r._idx}</td>
                    <td style={cellStyle}>{r.recipient_name || <span style={{ color: DANGER }}>—</span>}</td>
                    <td style={cellStyle}>{r.recipient_email || <span style={{ color: DANGER }}>—</span>}</td>
                    <td style={cellStyle}>{r.course || <span style={{ color: DANGER }}>—</span>}</td>
                    <td style={cellStyle}>{r.issue_date}</td>
                    <td style={cellStyle}>{r.expiry_date || '—'}</td>
                    <td style={cellStyle}>{r.tags || '—'}</td>
                    <td style={cellStyle}>
                      {r._valid
                        ? <Badge variant="success" size="sm">OK</Badge>
                        : <span style={{ color: DANGER, fontSize: 11 }}>{r._errors.join('; ')}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {running && (
            <div style={{ marginTop: SPACING.md }}>
              <div style={{ height: 6, backgroundColor: BORDER, borderRadius: RADIUS.full, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', backgroundColor: PRIMARY, borderRadius: RADIUS.full,
                  width: `${(progress / valid.length) * 100}%`, transition: 'width 0.3s ease',
                }} />
              </div>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 6, textAlign: 'center' }}>{progress} of {valid.length} issued</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'flex-end', marginTop: SPACING.md }}>
            <Button variant="ghost" onClick={() => setStep(1)} disabled={running}>Back</Button>
            <Button disabled={valid.length === 0 || invalid.length > 0} loading={running} onClick={runBulk}>
              Issue {valid.length} Certificate{valid.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', padding: SPACING.xl }}>
          <CheckCircle size={40} color={PRIMARY} />
          <p style={{ fontSize: 16, fontWeight: 600, color: TEXT, marginTop: SPACING.md }}>
            {valid.length} certificate{valid.length !== 1 ? 's' : ''} issued successfully.
          </p>
        </div>
      )}
    </Modal>
  );
}

const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: MUTED, padding: 4, borderRadius: RADIUS.sm,
  display: 'inline-flex', alignItems: 'center',
  transition: `color ${DURATION.fast}`,
};

export default function Certificates() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const certificates = useSelector(selectIssueCertificates);
  const total = useSelector(selectIssueTotal);
  const page = useSelector(selectIssuePage);
  const limit = useSelector(selectIssueLimit);
  const search = useSelector(selectIssueSearch);
  const filters = useSelector(selectIssueFilters);
  const loading = useSelector(selectIssueLoading);
  const selectedCert = useSelector(selectSelectedCert);
  const revoking = useSelector(selectRevoking);
  const revokeError = useSelector(selectRevokeError);

  const [issueOpen, setIssueOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'issue') {
      setIssueOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokePassword, setRevokePassword] = useState('');
  const [revokePasswordErr, setRevokePasswordErr] = useState('');

  const load = useCallback(() => {
    dispatch(fetchIssueCertificates({ token, page, limit, filters: { ...filters, search } }));
  }, [dispatch, token, page, limit, filters, search]);

  useEffect(() => { load(); }, [load]);

  function openDetail(cert) {
    dispatch(fetchCertificateDetail({ token, id: cert.certificate_id }));
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    dispatch(clearSelectedCert());
  }

  async function handleResendRow(cert) {
    const result = await dispatch(submitResendCertificate({ token, certId: cert.certificate_id }));
    if (!result.error) toast.success('Certificate email resent.');
    else toast.error(result.payload ?? 'Failed to resend.');
  }

  function openRevokeConfirm(cert) {
    setRevokeTarget(cert);
    setRevokePassword('');
    setRevokePasswordErr('');
  }

  async function confirmRevoke() {
    if (!revokePassword) { setRevokePasswordErr('Password is required.'); return; }
    const result = await dispatch(submitRevokeCertificate({ token, cert_hash: revokeTarget.cert_hash, password: revokePassword }));
    if (!result.error) {
      toast.success('Certificate revoked.');
      setRevokeTarget(null);
    } else {
      setRevokePasswordErr(result.payload ?? 'Incorrect password.');
    }
  }

  const FILTER_DEFS = [
    { key: 'status', label: 'Status', options: [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'revoked', label: 'Revoked' },
    ]},
    { key: 'expiry_status', label: 'Expiry', options: [
      { value: '', label: 'All Expiry' },
      { value: 'active', label: 'Active' },
      { value: 'expiring_soon', label: 'Expiring Soon' },
      { value: 'expired', label: 'Expired' },
    ]},
  ];

  const TABLE_COLUMNS = [
    { key: 'recipient_name', label: 'Recipient', render: r => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.recipient_name}</div>
        <div style={{ fontSize: 12, color: MUTED }}>{r.recipient_email}</div>
      </div>
    )},
    { key: 'course', label: 'Course', render: r => <span style={{ fontSize: 13 }}>{r.course}</span> },
    { key: 'tags', label: 'Tags', render: r => <TagList tags={r.tags} max={3} /> },
    { key: 'issue_date', label: 'Issue Date', render: r => r.issued_at ? new Date(r.issued_at).toLocaleDateString() : '—' },
    { key: 'expiry_date', label: 'Expiry', render: r => <ExpiryBadge expiry_date={r.expiry_date} /> },
    { key: 'verification_count', label: 'Verifications', render: r => (
      <span style={{ fontSize: 13, fontWeight: 600, color: INFO }}>{r.verification_count ?? 0}</span>
    )},
    { key: 'status', label: 'Status', render: r => r.is_revoked
      ? <Badge variant="danger" size="sm">Revoked</Badge>
      : <Badge variant="success" size="sm">Active</Badge>
    },
    { key: 'actions', label: '', render: r => (
      <div style={{ display: 'flex', gap: 4 }}>
        <button title="View" onClick={() => openDetail(r)} style={iconBtn}><Eye size={15} /></button>
        <button title="Resend" onClick={() => handleResendRow(r)} style={iconBtn}><Send size={15} /></button>
        {!r.is_revoked && (
          <button title="Revoke" onClick={() => openRevokeConfirm(r)} style={{ ...iconBtn, color: DANGER }}>
            <XCircle size={15} />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <OrgLayout>
      <PageTransition>
      <PageHeader
        title="Certificates"
        subtitle="Manage issued certificates"
        actions={[
          { label: 'Issue Certificate', onClick: () => setIssueOpen(true), icon: PlusCircle },
          { label: 'Bulk Issue', onClick: () => setBulkOpen(true), icon: Upload, variant: 'outline' },
        ]}
      />

      <div style={{ display: 'flex', gap: SPACING.md, alignItems: 'center', marginBottom: SPACING.md, flexWrap: 'wrap' }}>
        <SearchBar
          value={search}
          onChange={v => dispatch(setSearch(v))}
          placeholder="Search by recipient or course…"
          style={{ flex: 1, minWidth: 220 }}
        />
        <FilterBar
          filters={FILTER_DEFS}
          values={{ status: filters.status, expiry_status: filters.expiry_status }}
          onChange={(key, value) => dispatch(setFilters({ [key]: value }))}
          onReset={() => dispatch(resetFilters())}
        />
        <input
          type="date"
          value={filters.date_from}
          title="From date"
          onChange={e => dispatch(setFilters({ date_from: e.target.value }))}
          style={{ border: `1px solid ${BORDER}`, borderRadius: RADIUS.md, padding: '8px 12px', fontSize: 13, color: TEXT }}
        />
        <input
          type="date"
          value={filters.date_to}
          title="To date"
          onChange={e => dispatch(setFilters({ date_to: e.target.value }))}
          style={{ border: `1px solid ${BORDER}`, borderRadius: RADIUS.md, padding: '8px 12px', fontSize: 13, color: TEXT }}
        />
      </div>

      {!loading && certificates.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No certificates yet"
          description="Issue your first certificate to get started"
          action={{ label: 'Issue Certificate', onClick: () => setIssueOpen(true) }}
        />
      ) : (
        <Table
          columns={TABLE_COLUMNS}
          data={certificates}
          total={total}
          page={page}
          limit={limit}
          onPageChange={p => dispatch(setPage(p))}
          loading={loading}
        />
      )}

      <IssueModal
        isOpen={issueOpen}
        onClose={() => setIssueOpen(false)}
        token={token}
        onSuccess={() => { toast.success('Certificate issued.'); load(); }}
      />

      <DetailModal
        isOpen={detailOpen}
        onClose={closeDetail}
        cert={selectedCert}
        token={token}
        onRevokeRequest={openRevokeConfirm}
      />

      <BulkIssueModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        token={token}
        onSuccess={() => { toast.success('Bulk issue complete.'); load(); }}
      />

      <ConfirmDialog
        isOpen={!!revokeTarget}
        title="Revoke Certificate"
        message="This action is permanent and cannot be undone. The certificate will be marked as invalid on the blockchain."
        confirmLabel="Revoke"
        confirmVariant="danger"
        requirePassword
        password={revokePassword}
        onPasswordChange={v => { setRevokePassword(v); setRevokePasswordErr(''); }}
        passwordError={revokePasswordErr || revokeError}
        loading={revoking}
        onConfirm={confirmRevoke}
        onCancel={() => { setRevokeTarget(null); dispatch(clearRevokeError()); }}
      />
      </PageTransition>
    </OrgLayout>
  );
}
