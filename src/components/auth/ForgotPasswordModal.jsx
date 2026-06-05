import { useEffect, useRef, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { forgotPassword, verifyOtp, resetPassword } from '../../api/auth.api';
import { PRIMARY, MUTED, TEXT, BORDER, SURFACE, DANGER, SUCCESS } from '../../styles/tokens';
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react';

function maskEmail(email) {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.length > 2 ? local.slice(0, 2) : local[0];
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 1))}@${domain}`;
}

function passwordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak',   color: '#ef4444', pct: '25%' };
  if (score === 2) return { label: 'Fair',   color: '#f59e0b', pct: '50%' };
  if (score === 3) return { label: 'Good',   color: '#3b82f6', pct: '75%' };
  return             { label: 'Strong', color: '#22c55e', pct: '100%' };
}

const STEP_TITLES = {
  email:   'Reset Password',
  otp:     'Enter OTP',
  reset:   'Set New Password',
  success: 'Password Reset',
};

function resolveError(err, fallback) {
  return err?.data?.message || err?.message || fallback;
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }) {
  const [step,          setStep]          = useState('email');
  const [email,         setEmail]         = useState('');
  const [emailError,    setEmailError]    = useState('');
  const [otp,           setOtp]           = useState('');
  const [otpError,      setOtpError]      = useState('');
  const [resetToken,    setResetToken]    = useState('');
  const [newPw,         setNewPw]         = useState('');
  const [confirmPw,     setConfirmPw]     = useState('');
  const [pwErrors,      setPwErrors]      = useState({});
  const [globalError,   setGlobalError]   = useState('');
  const [loading,       setLoading]       = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setEmail('');
      setEmailError('');
      setOtp('');
      setOtpError('');
      setResetToken('');
      setNewPw('');
      setConfirmPw('');
      setPwErrors({});
      setGlobalError('');
      setLoading(false);
      setResendCooldown(0);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    }
  }, [isOpen]);

  function startCooldown() {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSendOtp(e) {
    e?.preventDefault();
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(email)) { setEmailError('Enter a valid email address.'); return; }
    setEmailError('');
    setGlobalError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep('otp');
      startCooldown();
    } catch (err) {
      setGlobalError(resolveError(err, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e?.preventDefault();
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) { setOtpError('Enter the 6-digit code from your email.'); return; }
    setOtpError('');
    setGlobalError('');
    setLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      setResetToken(data.reset_token);
      setStep('reset');
    } catch (err) {
      setOtpError(resolveError(err, 'Incorrect or expired OTP.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e?.preventDefault();
    const errs = {};
    if (!newPw) errs.newPw = 'Required';
    else if (newPw.length < 8) errs.newPw = 'Minimum 8 characters';
    if (!confirmPw) errs.confirmPw = 'Required';
    else if (newPw !== confirmPw) errs.confirmPw = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    setGlobalError('');
    setLoading(true);
    try {
      await resetPassword(resetToken, newPw);
      setStep('success');
    } catch (err) {
      setGlobalError(resolveError(err, 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setGlobalError('');
    setOtpError('');
    setOtp('');
    setLoading(true);
    try {
      await forgotPassword(email);
      startCooldown();
    } catch (err) {
      setGlobalError(resolveError(err, 'Failed to resend OTP.'));
    } finally {
      setLoading(false);
    }
  }

  const strength = passwordStrength(newPw);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={STEP_TITLES[step]} size="sm">

      {step === 'email' && (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
            Enter your registered email address and we'll send you a one-time code.
          </p>
          <Input
            id="forgot-email"
            label="Email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(''); setGlobalError(''); }}
            error={emailError}
            autoComplete="email"
            disabled={loading}
          />
          {globalError && (
            <p style={{ margin: 0, fontSize: 13, color: DANGER, fontWeight: 500 }}>{globalError}</p>
          )}
          <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
            Send Code
          </Button>
          {onBackToLogin && (
            <button
              type="button"
              onClick={onBackToLogin}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 13, padding: 0, alignSelf: 'center' }}
            >
              <ArrowLeft size={14} /> Back to login
            </button>
          )}
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8 }}>
            <Mail size={16} color={PRIMARY} />
            <span style={{ fontSize: 13, color: TEXT }}>
              Code sent to <strong>{maskEmail(email)}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>6-Digit Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); setGlobalError(''); }}
              placeholder="000000"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 10,
                textAlign: 'center',
                border: `1.5px solid ${otpError ? DANGER : BORDER}`,
                borderRadius: 8,
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: loading ? SURFACE : '#fff',
              }}
              onFocus={e => { if (!otpError) e.target.style.borderColor = PRIMARY; }}
              onBlur={e => { e.target.style.borderColor = otpError ? DANGER : BORDER; }}
            />
            {otpError && <p style={{ margin: 0, fontSize: 12, color: DANGER }}>{otpError}</p>}
          </div>
          {globalError && (
            <p style={{ margin: 0, fontSize: 13, color: DANGER, fontWeight: 500 }}>{globalError}</p>
          )}
          <Button type="submit" loading={loading} disabled={otp.length !== 6} style={{ width: '100%', justifyContent: 'center' }}>
            Verify Code
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setStep('email')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 12, padding: 0 }}
            >
              <ArrowLeft size={12} /> Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              style={{ background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer', color: resendCooldown > 0 ? MUTED : PRIMARY, fontSize: 12, padding: 0, fontWeight: 600 }}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
            Choose a new password for your account.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Input
              id="new-pw"
              label="New Password"
              type="password"
              showToggle
              value={newPw}
              onChange={e => { setNewPw(e.target.value); setPwErrors(p => ({ ...p, newPw: '' })); setGlobalError(''); }}
              error={pwErrors.newPw}
              disabled={loading}
            />
            {newPw && strength && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, backgroundColor: BORDER, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: strength.pct, height: '100%', backgroundColor: strength.color, borderRadius: 99, transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: 11, color: strength.color, fontWeight: 600, minWidth: 40 }}>{strength.label}</span>
              </div>
            )}
          </div>
          <Input
            id="confirm-pw"
            label="Confirm New Password"
            type="password"
            showToggle
            value={confirmPw}
            onChange={e => { setConfirmPw(e.target.value); setPwErrors(p => ({ ...p, confirmPw: '' })); }}
            error={pwErrors.confirmPw}
            disabled={loading}
          />
          {globalError && (
            <p style={{ margin: 0, fontSize: 13, color: DANGER, fontWeight: 500 }}>{globalError}</p>
          )}
          <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
            Reset Password
          </Button>
        </form>
      )}

      {step === 'success' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '8px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: `${PRIMARY}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={28} color={PRIMARY} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: TEXT }}>Password updated!</p>
            <p style={{ margin: 0, fontSize: 13, color: MUTED }}>You can now log in with your new password.</p>
          </div>
          <Button onClick={onBackToLogin ?? onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Back to Login
          </Button>
        </div>
      )}

    </Modal>
  );
}
