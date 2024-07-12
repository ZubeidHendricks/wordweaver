import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LetterWheel from './letterwheel';
import WordGrid from './WordGrid';
import ControlPanel from './ControlPanel';

const LETTER_POINTS = {
  'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
  'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1,
  'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
};
const calculateWordScore = (word) => {
  return word.split('').reduce((score, letter) => score + LETTER_POINTS[letter.toUpperCase()], 0);
};
const Game = () => {
  const [letters, setLetters] = useState([]);
  const [words, setWords] = useState([]);
  const [completedWords, setCompletedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get('/api/game/data');
        const { letters, words } = response.data;
        setLetters(letters);
        setWords(words);
      } catch (error) {
        console.error('Error fetching game data:', error);
        // Fallback data in case the API call fails
        setLetters(['W', 'O', 'R', 'D', 'S', 'C', 'A', 'P', 'E']);
        setWords(['WORD', 'SCORE', 'CAPE', 'PACE']);
      }
    };

    fetchGameData();
  }, []);

  const handleLetterSelect = (letter) => {
    setCurrentWord(prevWord => prevWord + letter);
  };

  const handleWordSubmit = () => {
    if (words.includes(currentWord) && !completedWords.includes(currentWord)) {
      const wordScore = calculateWordScore(currentWord);
      setScore(prevScore => prevScore + wordScore);
      setCompletedWords(prevWords => [...prevWords, currentWord]);
      setCurrentWord('');
    } else {
      // Handle invalid word
      setCurrentWord('');
    }
  };

  const handleReset = () => {
    setCurrentWord('');
  };

  return (
    <div className="game-container">
      <h1>Word Weaver</h1>
      <div className="score">Score: {score}</div>
      <LetterWheel letters={letters} onLetterSelect={handleLetterSelect} />
      <div className="current-word">Current Word: {currentWord}</div>
      <WordGrid words={words} completedWords={completedWords} />
      <ControlPanel 
        currentWord={currentWord}
        onWordSubmit={handleWordSubmit}
        onReset={handleReset}
      />
    </div>
  );
};

export default Game;