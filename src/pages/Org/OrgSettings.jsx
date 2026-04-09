import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrgLayout } from '../../components/org/OrgLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { selectToken } from '../../store/auth/authSelectors';
import { useToast } from '../../hooks/useToast';
import { submitChangePassword } from '../../features/orgSettings/orgSettingsThunks';
import { clearSettingsError } from '../../features/orgSettings/orgSettingsSlice';
import { selectSettingsSaving, selectSettingsError } from '../../features/orgSettings/orgSettingsSelectors';
import { BORDER, TEXT, MUTED, BG_SUBTLE } from '../../styles/tokens';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

function passwordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: '#ef4444' };
  if (score === 2) return { label: 'Fair', color: '#f59e0b' };
  if (score === 3) return { label: 'Good', color: '#3b82f6' };
  return { label: 'Strong', color: '#22c55e' };
}

export default function OrgSettings() {
  const dispatch = useDispatch();
  const token    = useSelector(selectToken);
  const saving   = useSelector(selectSettingsSaving);
  const apiError = useSelector(selectSettingsError);
  const toast    = useToast();

  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState({});

  const strength = passwordStrength(form.newPassword);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Required';
    if (!form.newPassword) e.newPassword = 'Required';
    else if (form.newPassword.length < 10) e.newPassword = 'Minimum 10 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Required';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    dispatch(clearSettingsError());

    const result = await dispatch(submitChangePassword({
      token,
      currentPassword: form.currentPassword,
      newPassword:     form.newPassword,
    }));

    if (submitChangePassword.fulfilled.match(result)) {
      toast.success('Password updated successfully.');
      setForm(EMPTY);
    } else {
      toast.error(result.payload ?? 'Failed to update password.');
    }
  };

  return (
    <OrgLayout title="Settings" subtitle="Manage your account settings">
      <div style={{ maxWidth: 480 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_SUBTLE }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>Change Password</h2>
            <p style={{ fontSize: 12, color: MUTED, margin: '4px 0 0' }}>Update your organisation account password</p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input
              id="currentPassword"
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
              error={errors.currentPassword}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Input
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="Minimum 10 characters"
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                error={errors.newPassword}
              />
              {form.newPassword && !errors.newPassword && strength && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 3, borderRadius: 4, backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 4,
                      backgroundColor: strength.color,
                      width: strength.label === 'Weak' ? '25%' : strength.label === 'Fair' ? '50%' : strength.label === 'Good' ? '75%' : '100%',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: strength.color, whiteSpace: 'nowrap' }}>{strength.label}</span>
                </div>
              )}
            </div>

            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              error={errors.confirmPassword}
            />

            {apiError && (
              <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, color: '#991b1b' }}>
                {apiError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
              <Button type="submit" loading={saving}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </OrgLayout>
  );
}
