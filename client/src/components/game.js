import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Paper, Grid, CircularProgress } from '@material-ui/core';
import { useSpring, animated } from 'react-spring';
import LetterWheel from './LetterWheel';
import WordGrid from './WordGrid';
import AdComponent from './Adcomponent.js';


const Game = ({ gameData, isDaily, user, showNotification }) => {
  const [letters, setLetters] = useState([]);
  const [words, setWords] = useState([]);
  const [guessedWords, setGuessedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStatus, setGameStatus] = useState('ready'); // 'ready', 'playing', 'finished'
  const [hints, setHints] = useState(3);
  const [showAd,setShowAd] =useState(false);
  const [loaded,setLoaded] = useState(false);


useEffect(() => {
//Show an ad every 5 games 
if(user.gamesPlayed % 5 === 0)
{
setShowAd(true);
}
},[user.gamesPlayed]);
 

  useEffect(() => {
    if (gameData) {
      setLetters(gameData.letters);
      setWords(gameData.words);
      setTimeLeft(gameData.timeLimit || 300); // Default to 5 minutes if not set
      setGameStatus('ready');
    }
  }, [gameData]);

  useEffect(() => {
    let timer;
    if (gameStatus === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameStatus, timeLeft]);

  const startGame = () => {
    setGameStatus('playing');
    setScore(0);
    setGuessedWords([]);
    setCurrentWord('');
  };

  const endGame = async () => {
    setGameStatus('finished');
    try {
      await axios.post('/api/user/stats', {
        score,
        wordsGuessed: guessedWords.length,
        timeTaken: gameData.timeLimit - timeLeft,
        isDaily,
      });
      showNotification('Game stats updated', 'success');

      //Show ad if it's time 
      if(user.gamesPlayed % 5 === 0) {
        setShowAd(true);
      }
    } catch (error) {
      showNotification('Error updating stats', 'error');
    }
  };

  const handleLetterSelect = (letter) => {
    setCurrentWord((prevWord) => prevWord + letter);
  };

  const handleWordSubmit = () => {
    if (words.includes(currentWord) && !guessedWords.includes(currentWord)) {
      const wordScore = currentWord.length * (isDaily ? 2 : 1); // Double points for daily challenge
      setScore((prevScore) => prevScore + wordScore);
      setGuessedWords((prevWords) => [...prevWords, currentWord]);
      showNotification(`Word "${currentWord}" is correct! +${wordScore} points`, 'success');
    } else if (guessedWords.includes(currentWord)) {
      showNotification('Word already guessed', 'warning');
    } else {
      showNotification('Not a valid word', 'error');
    }
    setCurrentWord('');
  };
  

 
  const useHint = () => {
    if (hints > 0) {
      const unguessedWords = words.filter((word) => !guessedWords.includes(word));
      if (unguessedWords.length > 0) {
        const randomWord = unguessedWords[Math.floor(Math.random() * unguessedWords.length)];
        const revealedLetter = randomWord[Math.floor(Math.random() * randomWord.length)];
        showNotification(`Hint: The letter "${revealedLetter}" is in one of the words`, 'info');
        setHints((prevHints) => prevHints - 1);
      }
    } else {
      showNotification('No hints remaining', 'warning');
    }
  };

  const scoreSpring = useSpring({ number: score, from: { number: 0 } });

  if (!gameData) {
    return <CircularProgress />;
  }

    return (
      <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
        <Typography variant="h4">{isDaily ? 'Daily Challenge' : 'Word Weaver'}</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <LetterWheel letters={letters} onLetterSelect={handleLetterSelect} />
          </Grid>
          <Grid item xs={12} md={6}>
            <WordGrid words={words} guessedWords={guessedWords} />
          </Grid>
        </Grid>
        <Typography variant="h6">
          Score: <animated.span>{scoreSpring.number.to((val) => Math.floor(val))}</animated.span>
        </Typography>
        <Typography variant="h6">Time Left: {timeLeft} seconds</Typography>
        <Typography variant="h6">Current Word: {currentWord}</Typography>
        <Button variant="contained" color="primary" onClick={handleWordSubmit} disabled={gameStatus !== 'playing'}>
          Submit Word
        </Button>
        <Button variant="contained" color="secondary" onClick={useHint} disabled={gameStatus !== 'playing' || hints === 0}>
          Use Hint ({hints} remaining)
        </Button>
        {gameStatus === 'ready' && (
          <Button variant="contained" color="primary" onClick={startGame}>
            Start Game
          </Button>
        )}
        {showAd && (
          <div style={{ margin: '20px 0' }}>
            <Typography variant="subtitle1">Advertisement</Typography>
            <AdComponent adSlot="5427959914" /> 
          </div>
        )}
        {gameStatus === 'finished' && (
          <div>
            <Typography variant="h5">Game Over!</Typography>
            <Typography variant="h6">Final Score: {score}</Typography>
            <Typography variant="h6">Words Guessed: {guessedWords.length}</Typography>
            <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
              Play Again
            </Button>
          </div>
        )}
      </Paper>
  );
};

export default Game;