import React from 'react';

const GameStage = ({ stage, onStageComplete }) => {
  const stages = {
    intro: {
      title: 'Welcome to WordWeaver!',
      message: "Let's learn new words together!",
      mascotMood: 'excited'
    },
    tutorial: {
      title: 'How to Play',
      message: 'Type the words as quickly as you can. Use hints if you need help!',
      mascotMood: 'thinking'
    },
    warmup: {
      title: 'Warm Up Round',
      message: "Let's start with something easy!",
      mascotMood: 'happy'
    },
    main: {
      title: 'Main Game',
      message: "You're doing great!",
      mascotMood: 'normal'
    },
    challenge: {
      title: 'Challenge Round',
      message: 'Extra points for speed!',
      mascotMood: 'surprised'
    },
    boss: {
      title: 'Boss Level',
      message: 'Can you handle these tricky words?',
      mascotMood: 'worried'
    },
    victory: {
      title: 'Victory!',
      message: 'Amazing job! You did it!',
      mascotMood: 'celebrating'
    },
    gameOver: {
      title: 'Game Over',
      message: "Don't give up! Try again!",
      mascotMood: 'sad'
    }
  };

  const currentStage = stages[stage];

  return (
    <div className="stage-container">
      <div className="stage-content">
        <h2>{currentStage.title}</h2>
        <p>{currentStage.message}</p>
        {onStageComplete && (
          <button onClick={onStageComplete} className="continue-btn">
            Continue
          </button>
        )}
      </div>

      <style jsx>{`
        .stage-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          animation: fadeIn 0.5s ease;
        }

        .stage-content {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          max-width: 400px;
          width: 90%;
          animation: slideIn 0.5s ease;
        }

        h2 {
          color: #2196f3;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        p {
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .continue-btn {
          background: #2196f3;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .continue-btn:hover {
          background: #1976d2;
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GameStage;