import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { onboardOrg } from '../../api/org.api';
import { useToast } from '../../hooks/useToast';
import { MUTED, PRIMARY } from '../../styles/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OrgOnboardModal({ isOpen, onClose, onSuccessOpenLogin, onSwitchToLogin }) {
  const toast = useToast();
  const [fields, setFields] = useState({ org_name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConflict, setIsConflict] = useState(false);

  const isDirty = fields.org_name !== '' || fields.email !== '' || fields.password !== '';

  useEffect(() => {
    if (!isOpen) {
      setFields({ org_name: '', email: '', password: '' });
      setFieldErrors({});
      setError('');
      setIsConflict(false);
      setLoading(false);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!fields.org_name || fields.org_name.trim().length < 2) errs.org_name = 'Organisation name must be at least 2 characters.';
    if (!EMAIL_RE.test(fields.email)) errs.email = 'Enter a valid email address.';
    if (fields.password.length < 10) errs.password = 'Password must be at least 10 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => () => {
    if (field === 'email' && fields.email && !EMAIL_RE.test(fields.email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Enter a valid email address.' }));
    }
    if (field === 'password' && fields.password && fields.password.length < 10) {
      setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 10 characters.' }));
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
    setFieldErrors({});
    setIsConflict(false);
    try {
      await onboardOrg({ org_name: fields.org_name, email: fields.email, password: fields.password });
      toast.success('Organisation registered. Please log in.');
      onClose();
      onSuccessOpenLogin();
    } catch (err) {
      if (err.status === 409) {
        setIsConflict(true);
        setError('An organisation with this email is already registered.');
      } else if (err.status === 422 && Array.isArray(err.data?.errors)) {
        const mapped = {};
        err.data.errors.forEach(msg => {
          if (msg.includes('"org_name"')) mapped.org_name = 'Check your organisation name.';
          else if (msg.includes('"email"')) mapped.email = 'Check your email address.';
          else if (msg.includes('"password"')) mapped.password = 'Password must be at least 10 characters.';
        });
        setFieldErrors(mapped);
      } else {
        setError(err.message ?? 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Organisation" isDirty={isDirty}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          id="onboard-orgname"
          name="org_name"
          label="Organisation Name"
          value={fields.org_name}
          onChange={handleChange}
          error={fieldErrors.org_name}
          disabled={loading}
          required
        />
        <Input
          id="onboard-email"
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
          id="onboard-password"
          name="password"
          label="Password"
          type="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur('password')}
          error={fieldErrors.password}
          hint="Minimum 10 characters."
          autoComplete="new-password"
          disabled={loading}
          required
        />
        {error && (
          <div style={{ fontSize: 13, color: '#ef4444', margin: 0 }}>
            {error}
            {isConflict && onSwitchToLogin && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  style={{ color: PRIMARY, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0, textDecoration: 'underline' }}
                >
                  Log in instead
                </button>
              </>
            )}
          </div>
        )}
        <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
          {loading ? 'Registering…' : 'Register'}
        </Button>
        {onSwitchToLogin && (
          <p style={{ textAlign: 'center', fontSize: 13, color: MUTED, margin: 0 }}>
            Already registered?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{ color: PRIMARY, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              Log in
            </button>
          </p>
        )}
      </form>
    </Modal>
  );
}
