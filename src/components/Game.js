import React, { useState, useEffect } from 'react';
import GameMascot from './GameMascot';
import GameStage from './GameStage';

const DIFFICULTY_LEVELS = {
  EASY: { name: 'Easy', minLength: 3, maxLength: 5, timeLimit: 60, points: 10 },
  MEDIUM: { name: 'Medium', minLength: 6, maxLength: 8, timeLimit: 45, points: 20 },
  HARD: { name: 'Hard', minLength: 9, maxLength: 12, timeLimit: 30, points: 30 }
};

const WORD_CATEGORIES = {
  ANIMALS: ['cat', 'dog', 'elephant', 'giraffe', 'penguin', 'lion'],
  COUNTRIES: ['usa', 'canada', 'brazil', 'france', 'germany', 'italy'],
  TECH: ['code', 'data', 'web', 'app', 'cloud', 'program']
};

const Game = () => {
  const [gameState, setGameState] = useState({
    isActive: false,
    currentWord: '',
    category: 'ANIMALS',
    difficulty: 'EASY',
    score: 0,
    streak: 0,
    timeLeft: 60,
    hintsLeft: 3,
  });

  const [userInput, setUserInput] = useState('');
  const [currentStage, setCurrentStage] = useState('main');
  const [mascotState, setMascotState] = useState({
    mood: 'normal',
    message: 'Ready to play!'
  });

  useEffect(() => {
    let timer;
    if (gameState.isActive && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isActive) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameState.isActive, gameState.timeLeft]);

  const startGame = () => {
    const newWord = WORD_CATEGORIES[gameState.category][0];
    setGameState(prev => ({
      ...prev,
      isActive: true,
      currentWord: newWord,
      timeLeft: DIFFICULTY_LEVELS[prev.difficulty].timeLimit,
      hintsLeft: 3
    }));
    setUserInput('');
    setMascotState({
      mood: 'excited',
      message: "Let's begin!"
    });
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isActive: false
    }));
    setMascotState({
      mood: 'sad',
      message: 'Game Over! Try again?'
    });
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!gameState.isActive) return;

    if (userInput.toLowerCase() === gameState.currentWord.toLowerCase()) {
      const points = DIFFICULTY_LEVELS[gameState.difficulty].points;
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1
      }));
      setMascotState({
        mood: 'celebrating',
        message: 'Great job!'
      });
    } else {
      setGameState(prev => ({ ...prev, streak: 0 }));
      setMascotState({
        mood: 'worried',
        message: 'Try again!'
      });
    }
    setUserInput('');
  };

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="game-header">
          <div className="score-info">
            <span>Score: {gameState.score}</span>
            <span>Streak: {gameState.streak}</span>
            <span>Time: {gameState.timeLeft}s</span>
          </div>

          <div className="game-controls">
            <select
              value={gameState.category}
              onChange={(e) => setGameState(prev => ({ ...prev, category: e.target.value }))}
              disabled={gameState.isActive}
            >
              {Object.keys(WORD_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={gameState.difficulty}
              onChange={(e) => setGameState(prev => ({ ...prev, difficulty: e.target.value }))}
              disabled={gameState.isActive}
            >
              {Object.keys(DIFFICULTY_LEVELS).map(level => (
                <option key={level} value={level}>
                  {DIFFICULTY_LEVELS[level].name}
                </option>
              ))}
            </select>

            <button
              onClick={gameState.isActive ? endGame : startGame}
              className={gameState.isActive ? 'stop-btn' : 'start-btn'}
            >
              {gameState.isActive ? 'End Game' : 'Start Game'}
            </button>
          </div>
        </div>

        {gameState.isActive && (
          <div className="game-area">
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

            <form onSubmit={handleGuess} className="guess-form">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.slice(0, gameState.currentWord.length))}
                placeholder="Type your guess"
                maxLength={gameState.currentWord.length}
                autoFocus
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>

      <GameMascot 
        mood={mascotState.mood}
        message={mascotState.message}
      />

      <style jsx>{`
        .game-container {
          position: relative;
          min-height: 100vh;
          padding: 20px;
        }

        .game-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .score-info {
          display: flex;
          gap: 20px;
        }

        .game-controls {
          display: flex;
          gap: 10px;
        }

        .game-controls select,
        .game-controls button {
          padding: 8px 16px;
          border: 2px solid #2196f3;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .start-btn {
          background: #4caf50 !important;
          color: white;
        }

        .stop-btn {
          background: #f44336 !important;
          color: white;
        }

        .word-display {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin: 20px 0;
        }

        .letter-box {
          width: 40px;
          height: 40px;
          border: 2px solid #2196f3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          border-radius: 4px;
        }

        .letter-box.correct {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
        }

        .letter-box.incorrect {
          background: #f44336;
          color: white;
          border-color: #f44336;
        }

        .guess-form {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin: 20px 0;
        }

        .guess-form input {
          padding: 8px 16px;
          font-size: 1.2rem;
          border: 2px solid #2196f3;
          border-radius: 4px;
          width: 200px;
        }

        .guess-form button {
          padding: 8px 24px;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Game;
