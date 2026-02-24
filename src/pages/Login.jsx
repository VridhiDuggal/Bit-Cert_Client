import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Hardcoded users for frontend only authentication
  const users = [
    { email: "admin@bitcert.com", password: "Admin123", role: "Admin" },
    { email: "issuer@bitcert.com", password: "Issuer123", role: "Issuer" },
    { email: "student@bitcert.com", password: "Student123", role: "Student" },
    { email: "verifier@bitcert.com", password: "Verifier123", role: "Verifier" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate email and password are not empty
    if (!email.trim() || !password) {
      setErrors({ general: 'Please fill in all fields' });
      return;
    }

    // Check if credentials match any user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Store role and token in localStorage
      localStorage.setItem('role', user.role);
      localStorage.setItem('token', 'mock-token-123');

      // Redirect based on role
      switch (user.role) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Issuer':
          navigate('/issuer');
          break;
        case 'Student':
          navigate('/student');
          break;
        case 'Verifier':
          navigate('/verifier');
          break;
        default:
          navigate('/');
      }
    } else {
      // Show invalid credentials error
      setErrors({ general: 'Invalid credentials' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2 className="login-title">Bit-Cert</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        
        {errors.general && (
          <div className="error-banner">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">Sign In</button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
