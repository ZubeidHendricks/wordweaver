import React from 'react';

const GameMascot = ({ mood, message }) => {
  // Different mascot expressions based on mood
  const expressions = {
    happy: '(◕‿◕)',
    thinking: '(¬‿¬)',
    excited: '(★ω★)',
    sad: '(╥﹏╥)',
    sleeping: '(─.─)zzz',
    normal: '(・ω・)',
    celebrating: '\\(^ω^)/',
    surprised: '(○o○)',
    worried: '(◍•﹏•)'
  };

  return (
    <div className="mascot-container">
      <div className={`mascot ${mood}`}>
        <div className="mascot-face">{expressions[mood] || expressions.normal}</div>
        <div className="mascot-body">
          /|\ <br />
          / \
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

        .mascot {
          text-align: center;
          font-size: 24px;
          transition: all 0.3s ease;
          animation: bounce 2s infinite;
        }

        .mascot.happy { transform: translateY(-5px); }
        .mascot.thinking { transform: rotate(5deg); }
        .mascot.excited { animation: jump 0.5s infinite; }
        .mascot.sad { transform: translateY(5px); }
        .mascot.sleeping { transform: rotate(-10deg); }
        .mascot.celebrating { animation: celebrate 1s infinite; }
        .mascot.surprised { animation: shake 0.5s infinite; }
        .mascot.worried { animation: wobble 2s infinite; }

        .mascot-face {
          font-size: 40px;
          margin-bottom: 5px;
        }

        .mascot-body {
          font-size: 20px;
          line-height: 1;
          color: #666;
        }

        .speech-bubble {
          position: relative;
          background: #fff;
          border-radius: 10px;
          padding: 10px 15px;
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
          border-color: transparent transparent transparent #fff;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes jump {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes celebrate {
          0% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
          100% { transform: rotate(-10deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes wobble {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
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