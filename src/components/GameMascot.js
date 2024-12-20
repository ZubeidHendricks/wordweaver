import React from 'react';

const GameMascot = ({ mood, message }) => {
  const getRobotExpression = (mood) => {
    const expressions = {
      normal: {
        eyes: '◔ ◔',
        mouth: '▿',
        antennas: '∧ ∧',
        color: '#64B5F6'
      },
      happy: {
        eyes: '◠ ◠',
        mouth: '‿',
        antennas: '∧ ∧',
        color: '#81C784'
      },
      thinking: {
        eyes: '◔ ◔',
        mouth: '―',
        antennas: '〳 〵',
        color: '#FFB74D'
      },
      excited: {
        eyes: '★ ★',
        mouth: '∀',
        antennas: '⟍ ⟋',
        color: '#FFD54F'
      },
      sad: {
        eyes: '︵ ︵',
        mouth: '︶',
        antennas: '∨ ∨',
        color: '#90A4AE'
      },
      celebrating: {
        eyes: '♥ ♥',
        mouth: '∀',
        antennas: '≫ ≪',
        color: '#EF5350'
      },
      surprised: {
        eyes: '⊙ ⊙',
        mouth: '○',
        antennas: '⟁ ⟁',
        color: '#7E57C2'
      },
      worried: {
        eyes: '◑ ◑',
        mouth: '⌒',
        antennas: '⌇ ⌇',
        color: '#FF7043'
      }
    };

    return expressions[mood] || expressions.normal;
  };

  const expression = getRobotExpression(mood);

  return (
    <div className="mascot-container">
      <div className="robot">
        <div className="antennas">{expression.antennas}</div>
        <div className="face">
          <div className="eyes">{expression.eyes}</div>
          <div className="mouth">{expression.mouth}</div>
        </div>
      </div>
      {message && <div className="speech-bubble">{message}</div>}

      <style jsx>{`
        .mascot-container {
          position: fixed;
          right: 20px;
          bottom: 20px;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          z-index: 100;
        }

        .robot {
          background: ${expression.color};
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          animation: float 3s infinite ease-in-out;
        }

        .antennas {
          font-size: 24px;
          text-align: center;
          color: white;
          margin-bottom: 5px;
          animation: wiggle 2s infinite ease-in-out;
        }

        .face {
          background: white;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
        }

        .eyes {
          font-size: 28px;
          line-height: 1;
          margin-bottom: 5px;
          animation: blink 4s infinite;
        }

        .mouth {
          font-size: 24px;
          line-height: 1;
        }

        .speech-bubble {
          position: relative;
          background: white;
          padding: 10px 15px;
          border-radius: 10px;
          max-width: 200px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          animation: fadeIn 0.3s ease;
        }

        .speech-bubble:after {
          content: '';
          position: absolute;
          right: -10px;
          bottom: 20px;
          border-width: 10px 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent transparent white;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes blink {
          0%, 48%, 52%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default GameMascot;