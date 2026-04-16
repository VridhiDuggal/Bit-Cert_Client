import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { loginRecipient } from '../../api/recipient.api';
import { recipientLoginSuccess } from '../../store/recipientAuth/recipientAuthSlice';
import { useToast } from '../../hooks/useToast';
import { MUTED } from '../../styles/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RecipientLoginModal({ isOpen, onClose }) {
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
      const result = await loginRecipient({ email: fields.email, password: fields.password });
      dispatch(recipientLoginSuccess({ token: result.token, recipient: result.recipient }));
      toast.success('Welcome back, ' + result.recipient.name + '!');
      onClose();
      navigate('/recipient/dashboard');
    } catch (err) {
      setError(err.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recipient Login" isDirty={isDirty}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          id="recipient-login-email"
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
          id="recipient-login-password"
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
          <p style={{ margin: 0, fontSize: 13, color: '#ef4444', fontWeight: 500 }}>{error}</p>
        )}
        <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
          Sign In
        </Button>
        <p style={{ margin: 0, fontSize: 12, color: MUTED, textAlign: 'center' }}>
          Don't have an account? Check your invite email.
        </p>
      </form>
    </Modal>
  );
}
