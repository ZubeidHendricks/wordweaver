import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully!');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="status-icon">{getStatusIcon()}</div>
        <h2>{status === 'verifying' ? 'Verifying your email...' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}</h2>
        <p>{message}</p>
        {status === 'success' && (
          <p className="redirect-message">Redirecting to login page...</p>
        )}
        {status === 'error' && (
          <button onClick={() => router.push('/login')} className="back-button">
            Back to Login
          </button>
        )}
      </div>

      <style jsx>{`
        .verification-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .verification-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .status-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        h2 {
          color: #2196f3;
          margin-bottom: 1rem;
        }

        p {
          color: #666;
          margin-bottom: 1rem;
        }

        .redirect-message {
          color: #4caf50;
          font-style: italic;
        }

        .back-button {
          padding: 0.5rem 1rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: #1976d2;
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;