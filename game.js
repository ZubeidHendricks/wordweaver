import React, { useState, useEffect } from 'react';
import LetterWheel from './LetterWheel';
import WordGrid from './WordGrid';
import ControlPanel from './ControlPanel';

const Game = () => {
  const [letters, setLetters] = useState([]);
  const [words, setWords] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // TODO: Fetch game data from server
  }, []);

  const handleWordSubmit = (word) => {
    // TODO: Validate word and update score
  };

  return (
    <div className="game-container">
      <LetterWheel letters={letters} />
      <WordGrid words={words} />
      <ControlPanel score={score} onWordSubmit={handleWordSubmit} />
    </div>
  );
};

export default Game;