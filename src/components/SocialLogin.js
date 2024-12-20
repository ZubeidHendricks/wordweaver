import React from 'react';
import Image from 'next/image';

const SocialLogin = ({ onLogin }) => {
  const handleSocialLogin = async (provider) => {
    try {
      // TODO: Implement actual social login
      const response = await fetch(`/api/auth/social/${provider}`);
      const data = await response.json();
      onLogin(data);
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <div className="social-login">
      <div className="divider">
        <span>or continue with</span>
      </div>

      <div className="social-buttons">
        <button 
          onClick={() => handleSocialLogin('google')} 
          className="social-button google"
        >
          <img 
            src="/images/google-icon.svg" 
            alt="Google" 
            width={20} 
            height={20} 
          />
          Continue with Google
        </button>

        <button 
          onClick={() => handleSocialLogin('facebook')} 
          className="social-button facebook"
        >
          <img 
            src="/images/facebook-icon.svg" 
            alt="Facebook" 
            width={20} 
            height={20} 
          />
          Continue with Facebook
        </button>

        <button 
          onClick={() => handleSocialLogin('github')} 
          className="social-button github"
        >
          <img 
            src="/images/github-icon.svg" 
            alt="GitHub" 
            width={20} 
            height={20} 
          />
          Continue with GitHub
        </button>
      </div>

      <style jsx>{`
        .social-login {
          width: 100%;
          margin-top: 24px;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e0e0e0;
        }

        .divider span {
          padding: 0 10px;
          color: #666;
          font-size: 0.9rem;
        }

        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .social-button:hover {
          background: #f5f5f5;
        }

        .social-button.google:hover {
          border-color: #4285f4;
        }

        .social-button.facebook:hover {
          border-color: #1877f2;
        }

        .social-button.github:hover {
          border-color: #24292e;
        }

        .social-button img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default SocialLogin;