import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LetterWheel from './letterwheel';
import WordGrid from './WordGrid';
import ControlPanel from './ControlPanel';

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
      setScore(prevScore => prevScore + currentWord.length);
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