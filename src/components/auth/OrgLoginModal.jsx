import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginOrg } from '../../api/org.api';
import { loginSuccess } from '../../store/auth/authSlice';
import { useToast } from '../../hooks/useToast';
import { MUTED, PRIMARY } from '../../styles/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OrgLoginModal({ isOpen, onClose, onSwitchToOnboard }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [fields, setFields] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDirty = fields.email !== '' || fields.password !== '';

  useEffect(() => {
    if (!isOpen) {
      setFields({ email: '', password: '' });
      setFieldErrors({});
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!EMAIL_RE.test(fields.email)) errs.email = 'Enter a valid email address.';
    if (!fields.password) errs.password = 'Password is required.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => () => {
    if (field === 'email' && fields.email && !EMAIL_RE.test(fields.email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Enter a valid email address.' }));
    }
  };

  const handleChange = (e) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const result = await loginOrg({ email: fields.email, password: fields.password });
      dispatch(loginSuccess({ token: result.token, org: result.org }));
      toast.success('Welcome back, ' + result.org.org_name + '!');
      onClose();
      navigate('/org/dashboard');
    } catch (err) {
      setError(err.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Organisation Login" isDirty={isDirty}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          id="login-email"
          name="email"
          label="Email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur('email')}
          error={fieldErrors.email}
          autoComplete="email"
          disabled={loading}
          required
        />
        <Input
          id="login-password"
          name="password"
          label="Password"
          type="password"
          showToggle
          value={fields.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
          disabled={loading}
          required
        />
        {error && (
          <p style={{ fontSize: 13, color: '#ef4444', margin: 0 }}>{error}</p>
        )}
        <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
          {loading ? 'Logging in…' : 'Log In'}
        </Button>
        {onSwitchToOnboard && (
          <p style={{ textAlign: 'center', fontSize: 13, color: MUTED, margin: 0 }}>
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToOnboard}
              style={{ color: PRIMARY, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              Register your organisation
            </button>
          </p>
        )}
      </form>
    </Modal>
  );
}
