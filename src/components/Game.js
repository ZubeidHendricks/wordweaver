import React, { useState, useEffect } from 'react';

const DIFFICULTY_LEVELS = {
  EASY: { name: 'Easy', minLength: 3, maxLength: 5, timeLimit: 60, points: 10 },
  MEDIUM: { name: 'Medium', minLength: 6, maxLength: 8, timeLimit: 45, points: 20 },
  HARD: { name: 'Hard', minLength: 9, maxLength: 12, timeLimit: 30, points: 30 }
};

const WORD_CATEGORIES = {
  ANIMALS: [
    'cat', 'dog', 'elephant', 'giraffe', 'penguin', 'rhinoceros',
    'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer', 'zebra'
  ],
  COUNTRIES: [
    'usa', 'canada', 'brazil', 'france', 'germany', 'italy',
    'japan', 'china', 'india', 'russia', 'spain', 'mexico'
  ],
  TECH: [
    'code', 'data', 'web', 'app', 'cloud', 'program',
    'digital', 'network', 'software', 'internet', 'computer'
  ],
  SCIENCE: [
    'atom', 'cell', 'dna', 'energy', 'force', 'gravity',
    'molecule', 'neutron', 'quantum', 'reaction', 'theory'
  ]
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
    usedWords: new Set()
  });

  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [hints, setHints] = useState([]);

  useEffect(() => {
    let timer;
    if (gameState.isActive && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameState.isActive, gameState.timeLeft]);

  const startGame = () => {
    const newWord = selectWord();
    setGameState(prev => ({
      ...prev,
      isActive: true,
      currentWord: newWord,
      timeLeft: DIFFICULTY_LEVELS[prev.difficulty].timeLimit,
      hintsLeft: 3,
      usedWords: new Set([newWord])
    }));
    setUserInput('');
    setHints([]);
    setMessage({ text: '', type: '' });
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isActive: false,
      currentWord: ''
    }));
    setMessage({
      text: `Game Over! Final Score: ${gameState.score}`,
      type: 'info'
    });
  };

  const selectWord = () => {
    const words = WORD_CATEGORIES[gameState.category].filter(word => {
      const { minLength, maxLength } = DIFFICULTY_LEVELS[gameState.difficulty];
      return word.length >= minLength && 
             word.length <= maxLength && 
             !gameState.usedWords.has(word);
    });

    if (words.length === 0) {
      return WORD_CATEGORIES[gameState.category][0]; // Reset if all words used
    }

    return words[Math.floor(Math.random() * words.length)];
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!gameState.isActive) return;

    if (userInput.toLowerCase() === gameState.currentWord.toLowerCase()) {
      const pointsEarned = calculatePoints();
      setGameState(prev => ({
        ...prev,
        score: prev.score + pointsEarned,
        streak: prev.streak + 1,
        currentWord: selectWord(),
        timeLeft: DIFFICULTY_LEVELS[prev.difficulty].timeLimit
      }));
      setMessage({
        text: `Correct! +${pointsEarned} points`,
        type: 'success'
      });
    } else {
      setGameState(prev => ({ ...prev, streak: 0 }));
      setMessage({
        text: 'Try again!',
        type: 'error'
      });
    }
    setUserInput('');
  };

  const calculatePoints = () => {
    const basePoints = DIFFICULTY_LEVELS[gameState.difficulty].points;
    const timeBonus = Math.floor(gameState.timeLeft / 2);
    const streakBonus = Math.floor(gameState.streak / 3) * 5;
    return basePoints + timeBonus + streakBonus;
  };

  const getHint = () => {
    if (gameState.hintsLeft <= 0) {
      setMessage({ text: 'No hints remaining!', type: 'error' });
      return;
    }

    const word = gameState.currentWord;
    const existingHints = hints;
    let newHint = '';

    const possibleHints = [
      `The word has ${word.length} letters`,
      `First letter is '${word[0]}'`,
      `Last letter is '${word[word.length - 1]}'`,
      `Contains ${(word.match(/[aeiou]/gi) || []).length} vowels`,
      `Middle letter is '${word[Math.floor(word.length / 2)]}'`
    ].filter(hint => !existingHints.includes(hint));

    if (possibleHints.length > 0) {
      newHint = possibleHints[Math.floor(Math.random() * possibleHints.length)];
      setHints([...existingHints, newHint]);
      setGameState(prev => ({
        ...prev,
        hintsLeft: prev.hintsLeft - 1
      }));
    }
  };

  return (
    <div className="game-container">
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
                className={`letter-box ${
                  userInput[index] ? 
                    userInput[index].toLowerCase() === letter.toLowerCase() ?
                      'correct' : 'incorrect' 
                    : ''
                }`}
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

          <div className="hints-section">
            <button 
              onClick={getHint}
              disabled={gameState.hintsLeft <= 0}
              className="hint-btn"
            >
              Get Hint ({gameState.hintsLeft} left)
            </button>
            <div className="hints-display">
              {hints.map((hint, index) => (
                <div key={index} className="hint">{hint}</div>
              ))}
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .game-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
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

        .hints-section {
          text-align: center;
          margin: 20px 0;
        }

        .hint-btn {
          padding: 8px 16px;
          background: #ff9800;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .hint-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .hints-display {
          margin-top: 10px;
        }

        .hint {
          display: inline-block;
          padding: 4px 8px;
          margin: 4px;
          background: #f0f0f0;
          border-radius: 4px;
        }

        .message {
          text-align: center;
          padding: 10px;
          margin-top: 20px;
          border-radius: 4px;
        }

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .message.error {
          background: #ffebee;
          color: #c62828;
        }

        .message.info {
          background: #e3f2fd;
          color: #1565c0;
        }
      `}</style>
    </div>
  );
};

export default Game;