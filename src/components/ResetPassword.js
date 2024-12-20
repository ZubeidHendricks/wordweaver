import React, { useState } from 'react';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setErrors(prev => ({ ...prev, password: passwordErrors }));
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: ['Passwords do not match'] }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Password reset successfully! Redirecting to login...'
        });
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to reset password'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="error-container">
        <div className="error-message">
          Invalid or missing reset token. Please request a new password reset.
        </div>
        <button onClick={() => router.push('/forgot-password')} className="back-button">
          Back to Forgot Password
        </button>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-card">
        <h2>Reset Your Password</h2>
        <p className="instruction">Please enter your new password below.</p>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <div className="error-list">
                {errors.password.map((error, index) => (
                  <div key={index} className="error-item">{error}</div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && (
              <div className="error-list">
                {errors.confirmPassword.map((error, index) => (
                  <div key={index} className="error-item">{error}</div>
                ))}
              </div>
            )}
          </div>

          {status && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .reset-password-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f5f5f5;
          padding: 20px;
        }

        .reset-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }

        h2 {
          color: #2196f3;
          margin-bottom: 1rem;
          text-align: center;
        }

        .instruction {
          color: #666;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #444;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: #2196f3;
          outline: none;
        }

        input.error {
          border-color: #f44336;
        }

        .error-list {
          margin-top: 0.5rem;
          color: #f44336;
          font-size: 0.875rem;
        }

        .error-item {
          margin-bottom: 0.25rem;
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #1976d2;
        }

        .submit-button:disabled {
          background: #90caf9;
          cursor: not-allowed;
        }

        .status-message {
          margin: 1rem 0;
          padding: 0.75rem;
          border-radius: 4px;
          text-align: center;
        }

        .status-message.success {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-message.error {
          background: #ffebee;
          color: #c62828;
        }

        .error-container {
          text-align: center;
          padding: 2rem;
        }

        .error-message {
          color: #f44336;
          margin-bottom: 1rem;
        }

        .back-button {
          padding: 0.5rem 1rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;