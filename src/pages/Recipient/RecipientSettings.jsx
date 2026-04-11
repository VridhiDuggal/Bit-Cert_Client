import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Copy, CheckCircle, AlertCircle, User, Calendar, Building2, Shield, KeyRound, Settings2 } from 'lucide-react';
import { RecipientLayout } from '../../components/recipient/RecipientLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tooltip } from '../../components/ui/Tooltip';
import { submitUpdateProfile, submitChangePassword, fetchRecipientProfile } from '../../features/recipientSettings/recipientSettingsThunks';
import {
  clearProfileError,
  clearPasswordError,
  clearPasswordSuccess,
} from '../../features/recipientSettings/recipientSettingsSlice';
import { selectRecipient, selectRecipientToken } from '../../store/recipientAuth/recipientAuthSelectors';
import { useToast } from '../../hooks/useToast';
import { formatMonthYear, formatRelativeTime } from '../../utils/formatDate';
import { copyToClipboard } from '../../utils/clipboard';
import * as T from '../../styles/tokens';

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: User },
  { id: 'security', label: 'Security', icon: KeyRound },
  { id: 'account',  label: 'Account',  icon: Settings2 },
];

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

function AccountRow({ icon, label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: `${T.SPACING.sm + 4}px 0`,
      borderBottom: last ? 'none' : `1px solid ${T.BORDER}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        <span style={{ fontSize: 14, color: T.MUTED }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, color: T.TEXT, fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

/* ── Profile Tab ─────────────────────────────────────────────────────────── */
function ProfileTab() {
  const dispatch = useDispatch();
  const toast = useToast();
  const recipient = useSelector(selectRecipient);
  const savingProfile = useSelector(s => s.recipientSettings.savingProfile);
  const profileError = useSelector(s => s.recipientSettings.profileError);

  const [name, setName] = useState(recipient?.name ?? '');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => { setName(recipient?.name ?? ''); }, [recipient?.name]);

  async function handleSave() {
    dispatch(clearProfileError());
    const result = await dispatch(submitUpdateProfile({ name }));
    if (!result.error) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
  }

  function copyDid() {
    if (recipient?.did) copyToClipboard(recipient.did, () => toast.success('DID copied!'));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: T.SPACING.lg }}>
      {/* Identity hero */}
      <Card>
        <div style={{
          display: 'flex', alignItems: 'center', gap: T.SPACING.md,
          paddingBottom: T.SPACING.lg, marginBottom: T.SPACING.lg,
          borderBottom: `1px solid ${T.BORDER}`,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: T.RADIUS.full, flexShrink: 0,
            background: `linear-gradient(135deg, ${T.PRIMARY} 0%, #3a5a40 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: T.SHADOW.md,
          }}>
            <span style={{ color: T.WHITE, fontSize: 24, fontWeight: 700 }}>
              {(recipient?.name?.[0] ?? '?').toUpperCase()}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.TEXT }}>{recipient?.name ?? '—'}</div>
            <div style={{ fontSize: 13, color: T.MUTED, marginTop: 3 }}>{recipient?.email ?? '—'}</div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: T.TEXT, marginBottom: T.SPACING.md }}>Edit Profile</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: T.SPACING.md }}>
          <Input id="name" label="Full Name" value={name} onChange={e => setName(e.target.value)} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: T.TEXT }}>Email</label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', fontSize: 14, borderRadius: T.RADIUS.md,
              border: `1.5px solid ${T.BORDER}`, backgroundColor: T.BG_SUBTLE, color: T.MUTED,
            }}>
              <span style={{ flex: 1 }}>{recipient?.email ?? '—'}</span>
              <Tooltip content="Email cannot be changed"><Lock size={14} color={T.TEXT_MUTED} /></Tooltip>
            </div>
          </div>

          {recipient?.did && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.TEXT }}>Decentralised Identity (DID)</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', fontSize: 12, fontFamily: 'monospace',
                borderRadius: T.RADIUS.md, border: `1.5px solid ${T.BORDER}`,
                backgroundColor: T.BG_SUBTLE, color: T.MUTED,
              }}>
                <span style={{ flex: 1, wordBreak: 'break-all' }}>{recipient.did}</span>
                <Tooltip content="Copy DID">
                  <button onClick={copyDid} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.TEXT_MUTED, flexShrink: 0 }}>
                    <Copy size={14} />
                  </button>
                </Tooltip>
              </div>
            </div>
          )}

          {profileError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: T.RADIUS.md, fontSize: 13, color: '#991B1B' }}>
              <AlertCircle size={14} /> {profileError}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button variant="primary" onClick={handleSave} loading={savingProfile}>Save Changes</Button>
            {savedFlash && (
              <span style={{ fontSize: 13, color: T.SUCCESS, display: 'flex', alignItems: 'center', gap: 4, animation: 'fadeOut 2s ease forwards' }}>
                <CheckCircle size={14} /> Profile updated
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── Security Tab ────────────────────────────────────────────────────────── */
function SecurityTab() {
  const dispatch = useDispatch();
  const savingPassword = useSelector(s => s.recipientSettings.savingPassword);
  const passwordError = useSelector(s => s.recipientSettings.passwordError);
  const passwordSuccess = useSelector(s => s.recipientSettings.passwordSuccess);

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (passwordSuccess) {
      const t = setTimeout(() => dispatch(clearPasswordSuccess()), 3000);
      return () => clearTimeout(t);
    }
  }, [passwordSuccess, dispatch]);

  const strength = passwordStrength(form.newPassword);

  function validate() {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Required';
    if (!form.newPassword) e.newPassword = 'Required';
    else if (form.newPassword.length < 10) e.newPassword = 'Minimum 10 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Required';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    dispatch(clearPasswordError());
    const result = await dispatch(submitChangePassword({ current_password: form.currentPassword, new_password: form.newPassword }));
    if (!result.error) setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  return (
    <Card>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.TEXT, marginBottom: 4 }}>Change Password</div>
      <div style={{ fontSize: 13, color: T.MUTED, marginBottom: T.SPACING.lg }}>
        Use a strong password that you don't use anywhere else.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: T.SPACING.md }}>
        <Input id="currentPassword" label="Current Password" type="password" value={form.currentPassword}
          onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} error={errors.currentPassword} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Input id="newPassword" label="New Password" type="password" value={form.newPassword}
            onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} error={errors.newPassword} />
          {form.newPassword && strength && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, backgroundColor: T.BORDER, borderRadius: T.RADIUS.full, overflow: 'hidden' }}>
                <div style={{ width: strength.pct, height: '100%', backgroundColor: strength.color, borderRadius: T.RADIUS.full, transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: 11, color: strength.color, fontWeight: 600, minWidth: 40 }}>{strength.label}</span>
            </div>
          )}
        </div>

        <Input id="confirmPassword" label="Confirm New Password" type="password" value={form.confirmPassword}
          onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} error={errors.confirmPassword} />

        {passwordError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: T.RADIUS.md, fontSize: 13, color: '#991B1B' }}>
            <AlertCircle size={14} /> {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#F0FDF4', border: `1px solid #BBF7D0`, borderRadius: T.RADIUS.md, fontSize: 13, color: '#166534' }}>
            <CheckCircle size={14} /> Password updated successfully
          </div>
        )}

        <Button variant="primary" onClick={handleSubmit} loading={savingPassword}>Update Password</Button>
      </div>
    </Card>
  );
}

/* ── Account Tab ─────────────────────────────────────────────────────────── */
function AccountTab() {
  const dispatch = useDispatch();
  const token = useSelector(selectRecipientToken);
  const profile = useSelector(s => s.recipientSettings.profile);
  const profileLoading = useSelector(s => s.recipientSettings.profileLoading);

  useEffect(() => {
    if (token) dispatch(fetchRecipientProfile());
  }, [dispatch, token]);

  const isActive = profile?.status === 'active';

  return (
    <Card>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.TEXT, marginBottom: 4 }}>Account Information</div>
      <div style={{ fontSize: 13, color: T.MUTED, marginBottom: T.SPACING.lg }}>
        Read-only details about your account.
      </div>

      {profileLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[80, 60, 70, 55].map((w, i) => (
            <div key={i} style={{
              width: `${w}%`, height: 16, borderRadius: T.RADIUS.sm,
              background: `linear-gradient(90deg, ${T.BORDER} 25%, ${T.SURFACE} 50%, ${T.BORDER} 75%)`,
              backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <AccountRow
            icon={<Calendar size={14} color={T.PRIMARY} />}
            label="Member since"
            value={formatMonthYear(profile?.created_at) ?? '—'}
          />
          <AccountRow
            icon={<Building2 size={14} color={T.PRIMARY} />}
            label="Invited by"
            value={profile?.invited_by_org_name ?? '—'}
          />
          <AccountRow
            icon={<Shield size={14} color={T.PRIMARY} />}
            label="Account status"
            value={
              <Badge variant={isActive ? 'success' : 'warning'} size="sm">
                {isActive ? 'Active' : 'Suspended'}
              </Badge>
            }
          />
          <AccountRow
            icon={<User size={14} color={T.PRIMARY} />}
            label="Last sign-in"
            value={profile?.last_login_at ? formatRelativeTime(profile.last_login_at) : '—'}
            last
          />
        </div>
      )}
    </Card>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */
export default function RecipientSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <RecipientLayout title="Settings" subtitle="Manage your profile and account preferences">
      <style>{`
        @keyframes fadeOut  { 0%{opacity:1} 80%{opacity:1} 100%{opacity:0} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      <div style={{ maxWidth: 640 }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: T.SPACING.lg,
          backgroundColor: T.SURFACE, borderRadius: T.RADIUS.md,
          padding: 4, border: `1px solid ${T.BORDER}`,
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 12px', fontSize: 13, fontWeight: active ? 600 : 500,
                  borderRadius: T.RADIUS.sm, border: 'none', cursor: 'pointer',
                  backgroundColor: active ? T.WHITE : 'transparent',
                  color: active ? T.TEXT : T.MUTED,
                  boxShadow: active ? T.SHADOW.sm : 'none',
                  transition: 'all 150ms ease',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'profile'  && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'account'  && <AccountTab />}
      </div>
    </RecipientLayout>
  );
}

