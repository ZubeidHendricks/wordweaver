import React, { useState } from 'react';
import Link from 'next/link';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // TODO: Implement actual password reset functionality
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus({
        type: 'success',
        message: 'Password reset instructions have been sent to your email'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <p className="instruction-text">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="reset-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="email-input"
            disabled={isSubmitting}
          />
        </div>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <button 
          type="submit" 
          className="reset-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Reset Password'}
        </button>

        <div className="links">
          <Link href="/login">
            <a className="back-to-login">Back to Login</a>
          </Link>
        </div>
      </form>

      <style jsx>{`
        .forgot-password-container {
          max-width: 400px;
          margin: 40px auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #2196f3;
          margin-bottom: 20px;
        }

        .instruction-text {
          color: #666;
          text-align: center;
          margin-bottom: 24px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .reset-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          color: #444;
          font-size: 0.9rem;
        }

        .email-input {
          padding: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .email-input:focus {
          border-color: #2196f3;
          outline: none;
        }

        .email-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .reset-button {
          padding: 12px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .reset-button:hover:not(:disabled) {
          background: #1976d2;
        }

        .reset-button:disabled {
          background: #90caf9;
          cursor: not-allowed;
        }

        .status-message {
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          font-size: 0.9rem;
        }

        .status-message.success {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-message.error {
          background: #ffebee;
          color: #c62828;
        }

        .links {
          text-align: center;
          margin-top: 16px;
        }

        .back-to-login {
          color: #2196f3;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .back-to-login:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;