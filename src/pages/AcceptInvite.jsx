import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldX, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { previewInvite, acceptInvite } from '../api/recipient.api';
import {
  PRIMARY, DANGER, BORDER, TEXT, MUTED, WHITE, SURFACE,
  SPACING, RADIUS, SHADOW,
} from '../styles/tokens';

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#ef4444', '#f59e0b', '#3b82f6', '#588157'];

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  // 'loading' | 'form' | 'submitting' | 'success' | 'error'
  const [step, setStep]               = useState('loading');
  const [preview, setPreview]         = useState(null);
  const [name, setName]               = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState('');
  const [visible, setVisible]         = useState(false);

  useEffect(() => {
    setVisible(true);
    if (!token) { setStep('error'); setServerError('Missing token. Please use the link from your invite email.'); return; }
    previewInvite(token)
      .then(data => { setPreview(data); setStep('form'); })
      .catch(err => { setServerError(err.message ?? 'Invalid or expired invite link.'); setStep('error'); });
  }, [token]);

  const strength = getStrength(password);

  function validate() {
    const e = {};
    if (!name.trim())      e.name     = 'Full name is required.';
    if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (password !== confirm) e.confirm  = 'Passwords do not match.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep('submitting');
    try {
      await acceptInvite({ token, name: name.trim(), password });
      setStep('success');
    } catch (err) {
      setServerError(err.message ?? 'Something went wrong. Please try again.');
      setStep('error');
    }
  }

  const cardStyle = {
    width: '100%',
    maxWidth: 440,
    margin: 'auto',
    backgroundColor: WHITE,
    borderRadius: RADIUS.lg,
    border: `1px solid ${BORDER}`,
    boxShadow: SHADOW.lg,
    padding: SPACING.xl,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: SURFACE,
      overflowY: 'auto', display: 'flex',
      alignItems: 'flex-start', justifyContent: 'center',
      padding: SPACING.xl,
    }}>
      <div style={cardStyle}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: SPACING.lg }}>
          <div style={{
            width: 48, height: 48, borderRadius: RADIUS.md,
            backgroundColor: PRIMARY, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
          }}>
            <span style={{ color: WHITE, fontWeight: 900, fontSize: 22, fontFamily: 'monospace' }}>B</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TEXT }}>Bit-Cert</h1>
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div style={{ textAlign: 'center', padding: `${SPACING.lg}px 0` }}>
            <Loader2 size={36} color={PRIMARY} style={{ animation: 'spin 1s linear infinite', marginBottom: SPACING.md }} />
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Verifying your invite link…</p>
          </div>
        )}

        {/* Form */}
        {(step === 'form' || step === 'submitting') && (
          <>
            <h2 style={{ margin: `0 0 ${SPACING.xs}px`, fontSize: 17, fontWeight: 700, color: TEXT }}>
              Accept your invitation
            </h2>
            <p style={{ margin: `0 0 ${SPACING.lg}px`, fontSize: 13, color: MUTED }}>
              {preview?.email
                ? <>Invited as <strong>{preview.email}</strong>. Create a password to activate your account.</>
                : 'Create a password to activate your recipient account.'}
            </p>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
              <Input
                id="name"
                label="Full Name"
                placeholder="Your full name"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })); }}
                error={errors.name}
                disabled={step === 'submitting'}
                autoFocus
              />
              <div>
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
                  error={errors.password}
                  disabled={step === 'submitting'}
                />
                {password.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 999,
                          backgroundColor: i <= strength ? STRENGTH_COLORS[strength] : '#e5e7eb',
                          transition: 'background-color 0.2s',
                        }} />
                      ))}
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: STRENGTH_COLORS[strength], fontWeight: 500 }}>
                      {STRENGTH_LABELS[strength]}
                    </p>
                  </div>
                )}
              </div>
              <Input
                id="confirm"
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setErrors(v => ({ ...v, confirm: undefined })); }}
                error={errors.confirm}
                disabled={step === 'submitting'}
              />
              <Button
                type="submit"
                loading={step === 'submitting'}
                style={{ width: '100%', justifyContent: 'center', marginTop: SPACING.xs }}
              >
                Activate Account
              </Button>
            </form>
          </>
        )}

        {/* Success */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: `${SPACING.sm}px 0` }}>
            <CheckCircle2 size={52} color={PRIMARY} style={{ marginBottom: SPACING.md }} />
            <h2 style={{ margin: `0 0 ${SPACING.xs}px`, fontSize: 18, fontWeight: 700, color: TEXT }}>
              Account activated!
            </h2>
            <p style={{ margin: `0 0 ${SPACING.lg}px`, fontSize: 13, color: MUTED }}>
              Your recipient account is ready. You can now sign in to view your certificates.
            </p>
            <Button style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/?openRecipientLogin=true')}>
              Sign In
            </Button>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div style={{ textAlign: 'center', padding: `${SPACING.sm}px 0` }}>
            <ShieldX size={52} color={DANGER} style={{ marginBottom: SPACING.md }} />
            <h2 style={{ margin: `0 0 ${SPACING.xs}px`, fontSize: 18, fontWeight: 700, color: TEXT }}>
              Invite unavailable
            </h2>
            <p style={{ margin: `0 0 ${SPACING.lg}px`, fontSize: 13, color: MUTED }}>
              {serverError || 'This invite link may have expired or already been used.'}
            </p>
            <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
