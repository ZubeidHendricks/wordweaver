import React, { useState } from 'react';

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to WordWeaver!',
      content: 'Your AI-powered word learning companion',
      image: '/tutorial/welcome.svg',
      tip: 'WordWeaver adapts to your learning style and helps you improve vocabulary.'
    },
    {
      title: 'Choose Your Challenge',
      content: 'Select from different difficulty levels and categories',
      image: '/tutorial/difficulty.svg',
      tip: 'The AI system will adjust difficulty based on your performance.'
    },
    {
      title: 'Guess the Word',
      content: 'Type your guess and see real-time feedback',
      image: '/tutorial/gameplay.svg',
      tip: 'Green letters are correct, red letters need correction.'
    },
    {
      title: 'Smart Hints',
      content: 'Get context-aware hints when needed',
      image: '/tutorial/hints.svg',
      tip: 'Hints are personalized based on your learning patterns.'
    },
    {
      title: 'Track Your Progress',
      content: 'View detailed learning analytics',
      image: '/tutorial/progress.svg',
      tip: 'The cognitive tracking system helps you understand your learning style.'
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <div className="tutorial-header">
          <div className="step-indicator">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index}
                className={`step-dot ${index === currentStep ? 'active' : ''}${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="tutorial-body">
          <div className="tutorial-image">
            <img 
              src={currentStepData.image} 
              alt={currentStepData.title}
              width={400}
              height={300}
            />
          </div>

          <div className="tutorial-text">
            <h2>{currentStepData.title}</h2>
            <p>{currentStepData.content}</p>
            <div className="tutorial-tip">
              <span className="tip-icon">💡</span>
              <span className="tip-text">{currentStepData.tip}</span>
            </div>
          </div>
        </div>

        <div className="tutorial-controls">
          <button 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="tutorial-button secondary"
          >
            Previous
          </button>
          <button 
            onClick={handleNext}
            className="tutorial-button primary"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Start Playing' : 'Next'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .tutorial-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 800px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .tutorial-header {
          margin-bottom: 24px;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e0e0e0;
          transition: all 0.3s ease;
        }

        .step-dot.active {
          background: #2196f3;
          transform: scale(1.2);
        }

        .step-dot.completed {
          background: #4caf50;
        }

        .tutorial-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .tutorial-image {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .tutorial-image img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .tutorial-text {
          text-align: center;
        }

        .tutorial-text h2 {
          color: #1976d2;
          margin-bottom: 12px;
          font-size: 1.8rem;
        }

        .tutorial-text p {
          color: #424242;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .tutorial-tip {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tip-icon {
          font-size: 1.4rem;
        }

        .tip-text {
          color: #666;
          font-size: 0.9rem;
        }

        .tutorial-controls {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .tutorial-button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tutorial-button.primary {
          background: #2196f3;
          color: white;
        }

        .tutorial-button.primary:hover {
          background: #1976d2;
        }

        .tutorial-button.secondary {
          background: #e0e0e0;
          color: #424242;
        }

        .tutorial-button.secondary:hover {
          background: #bdbdbd;
        }

        .tutorial-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (min-width: 768px) {
          .tutorial-body {
            flex-direction: row;
            text-align: left;
          }

          .tutorial-text {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Tutorial;