import React from 'react';

const PowerUps = ({ powerUps, onUsePowerUp, points }) => {
  const POWER_UPS = {
    timeBoost: {
      name: 'Time Boost',
      icon: '⏰',
      description: '+15 seconds',
      cost: 50,
      effect: 'Adds 15 seconds to your timer'
    },
    wordSkip: {
      name: 'Word Skip',
      icon: '➡️',
      description: 'Skip current word',
      cost: 75,
      effect: 'Move to next word without penalty'
    },
    extraHint: {
      name: 'Extra Hint',
      icon: '💡',
      description: '+1 hint',
      cost: 30,
      effect: 'Adds one hint'
    },
    letterReveal: {
      name: 'Letter Reveal',
      icon: '🔍',
      description: 'Reveal a letter',
      cost: 40,
      effect: 'Reveals a random letter'
    }
  };

  return (
    <div className="power-ups-container">
      <h3>Power-ups <span className="points">Points: {points}</span></h3>
      <div className="power-ups-grid">
        {Object.entries(POWER_UPS).map(([key, power]) => (
          <div 
            key={key} 
            className={`power-up ${points >= power.cost ? 'available' : 'disabled'}`}
            onClick={() => points >= power.cost && onUsePowerUp(key)}
          >
            <div className="power-icon">{power.icon}</div>
            <div className="power-info">
              <h4>{power.name}</h4>
              <p>{power.description}</p>
              <span className="cost">{power.cost} pts</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .power-ups-container {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        h3 {
          margin: 0 0 15px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .points {
          font-size: 0.9em;
          color: #2196f3;
        }

        .power-ups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .power-up {
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 2px solid transparent;
        }

        .power-up.available:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-color: #2196f3;
        }

        .power-up.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .power-icon {
          font-size: 24px;
        }

        .power-info {
          flex: 1;
        }

        .power-info h4 {
          margin: 0;
          font-size: 0.9em;
          color: #333;
        }

        .power-info p {
          margin: 4px 0;
          font-size: 0.8em;
          color: #666;
        }

        .cost {
          font-size: 0.8em;
          color: #2196f3;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default PowerUps;