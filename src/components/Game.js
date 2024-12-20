import React, { useState, useEffect } from 'react';
import GameMascot from './GameMascot';
import PowerUps from './PowerUps';

const Game = () => {
  // ... existing state management code ...

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="game-header">
          <div className="score-section">
            <div className="score-item">
              <span className="label">Score</span>
              <span className="value">{gameState.score}</span>
            </div>
            <div className="score-item">
              <span className="label">Streak</span>
              <span className="value">{gameState.streak}🔥</span>
            </div>
          </div>

          <div className="settings-section">
            <select
              value={gameState.category}
              onChange={(e) => setGameState(prev => ({ ...prev, category: e.target.value }))}
              disabled={gameState.isActive}
              className="select-input"
            >
              {Object.keys(WORD_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={gameState.difficulty}
              onChange={(e) => setGameState(prev => ({ ...prev, difficulty: e.target.value }))}
              disabled={gameState.isActive}
              className="select-input"
            >
              {Object.keys(DIFFICULTY_LEVELS).map(level => (
                <option key={level} value={level}>{DIFFICULTY_LEVELS[level].name}</option>
              ))}
            </select>
          </div>
        </div>

        {gameState.isActive ? (
          <div className="game-play-area">
            <div className="word-section">
              <div className="timer-display">
                <div className="timer-circle">
                  <div className="time-left">{gameState.timeLeft}</div>
                  <div className="time-label">seconds</div>
                  <svg className="timer-svg">
                    <circle 
                      r="58" 
                      cx="60" 
                      cy="60" 
                      style={{
                        strokeDasharray: '364.4247360229',
                        strokeDashoffset: `${364.4247360229 * (1 - gameState.timeLeft / DIFFICULTY_LEVELS[gameState.difficulty].timeLimit)}`
                      }}
                    />
                  </svg>
                </div>
              </div>

              <div className="word-display">
                {gameState.currentWord.split('').map((letter, index) => (
                  <div 
                    key={index} 
                    className={`letter-box ${userInput[index] ? 
                      userInput[index].toLowerCase() === letter.toLowerCase() ? 
                        'correct' : 'incorrect' : ''}`}
                  >
                    {userInput[index] || ''}
                  </div>
                ))}
              </div>

              <div className="hint-section">
                <button 
                  onClick={getHint} 
                  disabled={gameState.hintsLeft <= 0}
                  className="hint-button"
                >
                  💡 Hint ({gameState.hintsLeft})
                </button>
                <div className="hints-display">
                  {hints.map((hint, index) => (
                    <div key={index} className="hint-bubble">{hint}</div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGuess} className="guess-form">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.slice(0, gameState.currentWord.length))}
                  placeholder="Type your guess here..."
                  maxLength={gameState.currentWord.length}
                  autoFocus
                  className="guess-input"
                />
                <button type="submit" className="submit-button">Submit</button>
              </form>
            </div>

            <PowerUps
              powerUps={{
                timeBoost: true,
                wordSkip: true,
                extraHint: true,
                letterReveal: true
              }}
              onUsePowerUp={handlePowerUp}
              points={gameState.score}
            />
          </div>
        ) : (
          <div className="start-section">
            <button
              onClick={startGame}
              className="start-button"
            >
              Start Game
            </button>
          </div>
        )}
      </div>

      <GameMascot 
        mood={mascotState.mood}
        message={mascotState.message}
      />

      <style jsx>{`
        .game-container {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 2rem;
        }

        .game-content {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .score-section {
          display: flex;
          gap: 2rem;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .score-item .label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .score-item .value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2196f3;
        }

        .select-input {
          padding: 0.5rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          margin-left: 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .select-input:hover {
          border-color: #2196f3;
        }

        .game-play-area {
          display: flex;
          gap: 2rem;
        }

        .word-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .word-display {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin: 2rem 0;
        }

        .letter-box {
          width: 60px;
          height: 60px;
          border: 3px solid #e0e0e0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          background: white;
          transition: all 0.2s;
        }

        .letter-box.correct {
          background: #4caf50;
          color: white;
          border-color: #388e3c;
          animation: bounce 0.5s;
        }

        .letter-box.incorrect {
          background: #f44336;
          color: white;
          border-color: #d32f2f;
          animation: shake 0.5s;
        }

        .timer-display {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .timer-circle {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .time-left {
          font-size: 2rem;
          font-weight: bold;
          color: #2196f3;
        }

        .time-label {
          font-size: 0.8rem;
          color: #666;
        }

        .timer-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .timer-svg circle {
          fill: none;
          stroke: #2196f3;
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.1s;
        }

        .guess-form {
          width: 100%;
          max-width: 500px;
          display: flex;
          gap: 1rem;
        }

        .guess-input {
          flex: 1;
          padding: 1rem;
          font-size: 1.2rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .guess-input:focus {
          border-color: #2196f3;
          outline: none;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }

        .submit-button {
          padding: 1rem 2rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-button:hover {
          background: #1976d2;
        }

        .hint-button {
          padding: 0.75rem 1.5rem;
          background: #ff9800;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hint-button:hover:not(:disabled) {
          background: #f57c00;
        }

        .hint-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .hints-display {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 1rem;
        }

        .hint-bubble {
          background: #e3f2fd;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #1976d2;
          animation: fadeIn 0.3s;
        }

        .start-section {
          display: flex;
          justify-content: center;
          padding: 4rem 0;
        }

        .start-button {
          padding: 1.5rem 3rem;
          font-size: 1.5rem;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .start-button:hover {
          background: #388e3c;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Game;
