import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Bell, User, Shield, Trash2 } from 'lucide-react';
import { OrgLayout } from '../../components/org/OrgLayout';
import { PageTransition } from '../../components/shared/PageTransition';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { selectToken } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';
import {
  submitChangePassword, fetchOrgProfile, submitUpdateProfile,
  fetchNotifications, submitMarkNotificationRead,
  submitMarkAllNotificationsRead,
} from '../../features/orgSettings/orgSettingsThunks';
import {
  clearSettingsError, clearProfileError, setNotifPage,
} from '../../features/orgSettings/orgSettingsSlice';
import {
  selectSettingsSaving, selectSettingsError,
  selectSettingsProfile, selectProfileLoading, selectProfileSaving, selectProfileError,
  selectNotifications, selectNotifTotal, selectNotifPage, selectNotifLoading,
} from '../../features/orgSettings/orgSettingsSelectors';
import {
  BORDER, TEXT, MUTED, SURFACE, SURFACE_HOVER, BG_SUBTLE, WHITE,
  PRIMARY, DANGER, WARNING, INFO, SUCCESS,
  SPACING, RADIUS, SHADOW, DURATION, TEXT_SECONDARY,
} from '../../styles/tokens';
import { getAvatarColor, getInitials } from '../../utils/avatar';

// ── helpers ───────────────────────────────────────────────────────────────────
function passwordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak',   color: '#ef4444', pct: '25%' };
  if (score === 2) return { label: 'Fair',   color: '#f59e0b', pct: '50%' };
  if (score === 3) return { label: 'Good',   color: '#3b82f6', pct: '75%' };
  return             { label: 'Strong', color: '#22c55e', pct: '100%' };
}

function formatRelative(ts) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const NOTIF_LIMIT = 10;

// ── Tab nav ───────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'profile',       label: 'Profile',       icon: User   },
  { key: 'security',      label: 'Security',      icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell   },
];

function TabNav({ active, onChange }) {
  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: SPACING.lg }}>
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? PRIMARY : MUTED,
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${isActive ? PRIMARY : 'transparent'}`,
              marginBottom: -1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.xs,
              transition: `color ${DURATION.fast}`,
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{ backgroundColor: WHITE, borderRadius: RADIUS.lg, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: SHADOW.sm, marginBottom: SPACING.lg }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_SUBTLE }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: MUTED, margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ padding: 24 }}>
        {children}
      </div>
    </div>
  );
}

// ── Profile tab ───────────────────────────────────────────────────────────────
function ProfileTab({ token }) {
  const dispatch     = useDispatch();
  const profile      = useSelector(selectSettingsProfile);
  const loading      = useSelector(selectProfileLoading);
  const saving       = useSelector(selectProfileSaving);
  const apiError     = useSelector(selectProfileError);
  const toast        = useToast();

  const [form, setForm]   = useState({ logo_url: '', website: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchOrgProfile(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (profile) {
      setForm({
        logo_url:    profile.logo_url    ?? '',
        website:     profile.website     ?? '',
        description: profile.description ?? '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (apiError) { toast.error(apiError); dispatch(clearProfileError()); }
  }, [apiError, toast, dispatch]);

  const validateUrl = (v) => { try { if (v) new URL(v); return true; } catch { return false; } };

  const validate = () => {
    const e = {};
    if (form.logo_url && !validateUrl(form.logo_url)) e.logo_url = 'Must be a valid URL';
    if (form.website  && !validateUrl(form.website))  e.website  = 'Must be a valid URL';
    if (form.description.length > 500) e.description = 'Maximum 500 characters';
    return e;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await dispatch(submitUpdateProfile({ token, ...form }));
    if (submitUpdateProfile.fulfilled.match(result)) {
      toast.success('Profile updated.');
    } else {
      toast.error(result.payload ?? 'Failed to update profile.');
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.xl }}><Loader size="md" /></div>;

  return (
    <SectionCard title="Organisation Profile" subtitle="Customise how your organisation appears.">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {/* Logo preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm }}>
          <div style={{
            width: 72, height: 72, borderRadius: RADIUS.lg, overflow: 'hidden',
            border: `1.5px solid ${BORDER}`, backgroundColor: SURFACE,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {form.logo_url
              ? <img src={form.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
              : <div style={{ width: '100%', height: '100%', backgroundColor: getAvatarColor(profile?.org_name ?? ''), display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHITE, fontWeight: 700, fontSize: 22 }}>{getInitials(profile?.org_name ?? '')}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <Input
              id="logo_url"
              label="Logo URL"
              placeholder="https://example.com/logo.png"
              value={form.logo_url}
              onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))}
              error={errors.logo_url}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Organisation Name</label>
          <input
            disabled
            value={profile?.org_name ?? ''}
            style={{ padding: '10px 12px', borderRadius: RADIUS.sm, border: `1.5px solid ${BORDER}`, fontSize: 14, color: MUTED, backgroundColor: SURFACE, cursor: 'not-allowed' }}
          />
          <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>Contact support to change your organisation name.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Email</label>
          <input
            disabled
            value={profile?.email ?? ''}
            style={{ padding: '10px 12px', borderRadius: RADIUS.sm, border: `1.5px solid ${BORDER}`, fontSize: 14, color: MUTED, backgroundColor: SURFACE, cursor: 'not-allowed' }}
          />
        </div>

        <Input
          id="website"
          label="Website"
          placeholder="https://yourorganisation.com"
          value={form.website}
          onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
          error={errors.website}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Description</label>
            <span style={{ fontSize: 11, color: form.description.length > 480 ? DANGER : MUTED }}>
              {form.description.length}/500
            </span>
          </div>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="A short description of your organisation"
            style={{
              padding: '10px 12px', borderRadius: RADIUS.sm,
              border: `1.5px solid ${errors.description ? DANGER : BORDER}`,
              fontSize: 14, color: TEXT, resize: 'vertical', fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          {errors.description && <span style={{ fontSize: 12, color: DANGER }}>{errors.description}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" loading={saving}>Save Profile</Button>
        </div>
      </form>
    </SectionCard>
  );
}

// ── Security tab ──────────────────────────────────────────────────────────────
const EMPTY_PW = { currentPassword: '', newPassword: '', confirmPassword: '' };

function SecurityTab({ token }) {
  const dispatch = useDispatch();
  const saving   = useSelector(selectSettingsSaving);
  const apiError = useSelector(selectSettingsError);
  const toast    = useToast();

  const [form, setForm]         = useState(EMPTY_PW);
  const [errors, setErrors]     = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const strength = passwordStrength(form.newPassword);

  useEffect(() => {
    if (apiError) { toast.error(apiError); dispatch(clearSettingsError()); }
  }, [apiError, toast, dispatch]);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Required';
    if (!form.newPassword) e.newPassword = 'Required';
    else if (form.newPassword.length < 10) e.newPassword = 'Minimum 10 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Required';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    dispatch(clearSettingsError());
    const result = await dispatch(submitChangePassword({ token, currentPassword: form.currentPassword, newPassword: form.newPassword }));
    if (submitChangePassword.fulfilled.match(result)) {
      toast.success('Password updated successfully.');
      setForm(EMPTY_PW);
    } else {
      toast.error(result.payload ?? 'Failed to update password.');
    }
  }

  return (
    <>
      <SectionCard title="Change Password" subtitle="Update your organisation account password.">
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
          <Input id="currentPassword" label="Current Password" type="password" placeholder="Enter current password"
            value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
            error={errors.currentPassword} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Input id="newPassword" label="New Password" type="password" placeholder="Minimum 10 characters"
              value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
              error={errors.newPassword} />
            {form.newPassword && !errors.newPassword && strength && (
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                <div style={{ flex: 1, height: 3, borderRadius: 4, backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, backgroundColor: strength.color, width: strength.pct, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: strength.color, whiteSpace: 'nowrap' }}>{strength.label}</span>
              </div>
            )}
          </div>
          <Input id="confirmPassword" label="Confirm New Password" type="password" placeholder="Repeat new password"
            value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
            error={errors.confirmPassword} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={saving}>Update Password</Button>
          </div>
        </form>
      </SectionCard>

      {/* Danger zone */}
      <div style={{ backgroundColor: WHITE, borderRadius: RADIUS.lg, border: `1.5px solid ${DANGER}22`, overflow: 'hidden', boxShadow: SHADOW.sm }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${DANGER}22`, backgroundColor: `${DANGER}08` }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: DANGER, margin: 0 }}>Danger Zone</h2>
          <p style={{ fontSize: 12, color: MUTED, margin: '4px 0 0' }}>Irreversible and destructive actions.</p>
        </div>
        <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, margin: 0 }}>Delete Organisation</p>
            <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>Permanently delete this organisation and all its data.</p>
          </div>
          <Button variant="outline" style={{ borderColor: DANGER, color: DANGER }} onClick={() => setShowConfirm(true)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Organisation"
        message="This action cannot be undone. All data will be permanently deleted."
        confirmLabel="Delete permanently"
        confirmVariant="danger"
        onConfirm={() => { setShowConfirm(false); toast.success('Account deletion is not available in the MVP.'); }}
        onCancel={() => { setShowConfirm(false); setDeleteInput(''); }}
      />
    </>
  );
}

// ── Notifications tab ─────────────────────────────────────────────────────────
function NotificationsTab({ token }) {
  const dispatch       = useDispatch();
  const notifications  = useSelector(selectNotifications);
  const total          = useSelector(selectNotifTotal);
  const page           = useSelector(selectNotifPage);
  const loading        = useSelector(selectNotifLoading);
  const toast          = useToast();

  useEffect(() => {
    dispatch(fetchNotifications({ token, page, limit: NOTIF_LIMIT }));
  }, [dispatch, token, page]);

  async function handleMarkRead(id) {
    const result = await dispatch(submitMarkNotificationRead({ token, id }));
    if (submitMarkNotificationRead.rejected.match(result)) toast.error('Failed to mark as read.');
  }

  async function handleMarkAll() {
    const result = await dispatch(submitMarkAllNotificationsRead(token));
    if (submitMarkAllNotificationsRead.rejected.match(result)) toast.error('Failed to mark all as read.');
    else toast.success('All notifications marked as read.');
  }

  const hasPrev = page > 1;
  const hasNext = page * NOTIF_LIMIT < total;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>
          Notifications {total > 0 && <span style={{ color: MUTED, fontWeight: 400 }}>({total})</span>}
        </h3>
        {notifications.some(n => !n.read_at) && (
          <Button variant="ghost" style={{ fontSize: 13, padding: '6px 12px' }} onClick={handleMarkAll}>
            Mark all as read
          </Button>
        )}
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.xl }}><Loader size="md" /></div>}

      {!loading && notifications.length === 0 && (
        <EmptyState icon={Bell} title="No notifications" description="You'll be notified here about certificates, invites, and activity." />
      )}

      {!loading && notifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
          {notifications.map(n => {
            const unread = !n.read_at;
            return (
              <div
                key={n.notification_id}
                onClick={() => !n.read_at && handleMarkRead(n.notification_id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: RADIUS.md,
                  border: `1.5px solid ${unread ? `${PRIMARY}44` : BORDER}`,
                  backgroundColor: unread ? `${PRIMARY}08` : WHITE,
                  cursor: unread ? 'pointer' : 'default',
                  transition: `background ${DURATION.fast}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: SPACING.md,
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: unread ? 700 : 400, color: TEXT, margin: 0 }}>{n.title}</p>
                  <p style={{ fontSize: 12, color: TEXT_SECONDARY, margin: '4px 0 0' }}>{n.message}</p>
                </div>
                <span style={{ fontSize: 11, color: MUTED, whiteSpace: 'nowrap', marginTop: 2 }}>
                  {formatRelative(n.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {total > NOTIF_LIMIT && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.lg }}>
          <button onClick={() => dispatch(setNotifPage(page - 1))} disabled={!hasPrev}
            style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: RADIUS.sm, border: `1.5px solid ${BORDER}`, backgroundColor: WHITE, color: hasPrev ? TEXT : MUTED, cursor: hasPrev ? 'pointer' : 'not-allowed', opacity: hasPrev ? 1 : 0.5 }}>
            ← Previous
          </button>
          <button onClick={() => dispatch(setNotifPage(page + 1))} disabled={!hasNext}
            style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: RADIUS.sm, border: `1.5px solid ${BORDER}`, backgroundColor: WHITE, color: hasNext ? TEXT : MUTED, cursor: hasNext ? 'pointer' : 'not-allowed', opacity: hasNext ? 1 : 0.5 }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OrgSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useSelector(selectToken);

  const initialTab = ['profile', 'security', 'notifications'].includes(searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'profile';

  const [tab, setTab] = useState(initialTab);

  function handleTabChange(key) {
    setTab(key);
    setSearchParams(key === 'profile' ? {} : { tab: key });
  }

  return (
    <OrgLayout title="Settings" subtitle="Manage your account settings">
      <PageTransition>
      <div style={{ maxWidth: 660 }}>
        <TabNav active={tab} onChange={handleTabChange} />
        {tab === 'profile'       && <ProfileTab       token={token} />}
        {tab === 'security'      && <SecurityTab      token={token} />}
        {tab === 'notifications' && <NotificationsTab token={token} />}
      </div>
      </PageTransition>
    </OrgLayout>
  );
}
