import React, { useState, useEffect } from 'react';
import GameMascot from './GameMascot';
import GameStage from './GameStage';

const DIFFICULTY_LEVELS = {
  EASY: { name: 'Easy', minLength: 3, maxLength: 5, timeLimit: 60, points: 10 },
  MEDIUM: { name: 'Medium', minLength: 6, maxLength: 8, timeLimit: 45, points: 20 },
  HARD: { name: 'Hard', minLength: 9, maxLength: 12, timeLimit: 30, points: 30 }
};

const WORD_CATEGORIES = {
  ANIMALS: ['cat', 'dog', 'elephant', 'giraffe', 'penguin', 'lion', 'tiger', 'bear'],
  COUNTRIES: ['usa', 'canada', 'brazil', 'france', 'germany', 'italy', 'spain'],
  TECH: ['code', 'data', 'web', 'app', 'cloud', 'program', 'digital', 'network']
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
    usedWords: new Set(),
  });

  const [userInput, setUserInput] = useState('');
  const [hints, setHints] = useState([]);
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

  const selectWord = () => {
    const words = WORD_CATEGORIES[gameState.category].filter(word => {
      const { minLength, maxLength } = DIFFICULTY_LEVELS[gameState.difficulty];
      return word.length >= minLength && 
             word.length <= maxLength && 
             !gameState.usedWords.has(word);
    });

    if (words.length === 0) {
      // Reset used words if all words have been used
      setGameState(prev => ({ ...prev, usedWords: new Set() }));
      return WORD_CATEGORIES[gameState.category][0];
    }

    return words[Math.floor(Math.random() * words.length)];
  };

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

  const getHint = () => {
    if (gameState.hintsLeft <= 0) {
      setMascotState({
        mood: 'worried',
        message: 'No hints left!'
      });
      return;
    }

    const word = gameState.currentWord;
    const possibleHints = [
      `The word has ${word.length} letters`,
      `First letter is '${word[0]}'`,
      `Last letter is '${word[word.length - 1]}'`,
      `Contains ${(word.match(/[aeiou]/gi) || []).length} vowels`,
      `Middle letter is '${word[Math.floor(word.length / 2)]}'`
    ].filter(hint => !hints.includes(hint));

    if (possibleHints.length > 0) {
      const newHint = possibleHints[Math.floor(Math.random() * possibleHints.length)];
      setHints([...hints, newHint]);
      setGameState(prev => ({
        ...prev,
        hintsLeft: prev.hintsLeft - 1
      }));
      setMascotState({
        mood: 'thinking',
        message: 'Here\'s a hint for you!'
      });
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!gameState.isActive) return;

    if (userInput.toLowerCase() === gameState.currentWord.toLowerCase()) {
      const newWord = selectWord();
      const points = DIFFICULTY_LEVELS[gameState.difficulty].points;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        currentWord: newWord,
        timeLeft: DIFFICULTY_LEVELS[prev.difficulty].timeLimit,
        usedWords: new Set([...prev.usedWords, newWord])
      }));
      
      setMascotState({
        mood: 'celebrating',
        message: 'Great job!'
      });
      
      setHints([]); // Reset hints for new word
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
            <span>Hints: {gameState.hintsLeft}</span>
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

            <div className="hint-section">
              <button 
                onClick={getHint} 
                disabled={gameState.hintsLeft <= 0}
                className="hint-button"
              >
                Get Hint ({gameState.hintsLeft} left)
              </button>
              <div className="hints-display">
                {hints.map((hint, index) => (
                  <div key={index} className="hint">{hint}</div>
                ))}
              </div>
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
        /* Previous styles remain the same */
        
        .hint-section {
          margin: 20px 0;
          text-align: center;
        }

        .hint-button {
          padding: 8px 16px;
          background: #ff9800;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .hint-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .hints-display {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .hint {
          background: #f0f0f0;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Game;
