import React, { useState, useEffect } from 'react';

const DIFFICULTY_LEVELS = {
  EASY: { name: 'Easy', minLength: 3, maxLength: 5, timeLimit: 60, points: 10 },
  MEDIUM: { name: 'Medium', minLength: 6, maxLength: 8, timeLimit: 45, points: 20 },
  HARD: { name: 'Hard', minLength: 9, maxLength: 12, timeLimit: 30, points: 30 }
};

const CATEGORIES = [
  'Animals',
  'Countries',
  'Food',
  'Sports',
  'Technology',
  'Nature'
];

const WORDS = {
  Animals: {
    EASY: ['cat', 'dog', 'rat', 'pig', 'owl'],
    MEDIUM: ['elephant', 'giraffe', 'penguin'],
    HARD: ['rhinoceros', 'hippopotamus']
  },
  Technology: {
    EASY: ['app', 'web', 'code'],
    MEDIUM: ['computer', 'program'],
    HARD: ['javascript', 'algorithm']
  }
};

const Game = () => {
  const [difficulty, setDifficulty] = useState('EASY');
  const [category, setCategory] = useState('Animals');
  const [currentWord, setCurrentWord] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [hints, setHints] = useState([]);
  const [hintCount, setHintCount] = useState(3);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const generateNewWord = () => {
    const words = WORDS[category][difficulty];
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setGuess('');
    setHints([]);
    setHintCount(3);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    setGameActive(true);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      const points = DIFFICULTY_LEVELS[difficulty].points;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      generateNewWord();
    } else {
      setStreak(0);
    }
  };

  const handleGameOver = () => {
    setGameActive(false);
  };

  const generateHint = () => {
    if (hintCount <= 0) return;

    const hintTypes = [
      `The word has ${currentWord.length} letters`,
      `The word starts with '${currentWord[0]}'`,
      `The word ends with '${currentWord[currentWord.length - 1]}'`
    ];

    const availableHints = hintTypes.filter(hint => !hints.includes(hint));
    if (availableHints.length > 0) {
      const newHint = availableHints[Math.floor(Math.random() * availableHints.length)];
      setHints(prev => [...prev, newHint]);
      setHintCount(prev => prev - 1);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Word Weaver</h1>
        <div className="score-display">
          <p>Score: {score}</p>
          <p>Streak: {streak}</p>
        </div>
      </div>

      <div className="game-controls">
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={gameActive}
        >
          {Object.keys(DIFFICULTY_LEVELS).map((level) => (
            <option key={level} value={level}>
              {DIFFICULTY_LEVELS[level].name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={gameActive}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button 
          onClick={generateNewWord}
          disabled={gameActive}
        >
          New Game
        </button>
      </div>

      {gameActive && (
        <div className="game-area">
          <div className="timer">Time Left: {timeLeft}s</div>
          
          <div className="word-display">
            {currentWord.split('').map((letter, index) => (
              <div 
                key={index} 
                className={`letter-box ${guess[index] ? 
                  (guess[index].toLowerCase() === letter.toLowerCase() ? 
                    'correct' : 'incorrect') : ''}`}
              >
                {guess[index] || ''}
              </div>
            ))}
          </div>

          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.slice(0, currentWord.length))}
              placeholder="Enter your guess"
              maxLength={currentWord.length}
              autoFocus
            />
            <button type="submit">Submit</button>
          </form>

          <button 
            onClick={generateHint}
            disabled={hintCount <= 0}
          >
            Get Hint ({hintCount} left)
          </button>

          <div className="hints-display">
            {hints.map((hint, index) => (
              <div key={index} className="hint">{hint}</div>
            ))}
          </div>
        </div>
      )}

      {!gameActive && (
        <div className="start-prompt">
          <p>Press 'New Game' to start!</p>
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

        .game-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
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
          border: 2px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .correct {
          background-color: #4caf50;
          color: white;
        }

        .incorrect {
          background-color: #f44336;
          color: white;
        }

        .hints-display {
          margin-top: 20px;
        }

        .hint {
          padding: 10px;
          margin: 5px 0;
          background-color: #f0f0f0;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Game;