import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Snackbar
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

// Comprehensive word list with difficulty tiers
const WORD_LISTS = {
  easy: ['HELLO', 'WORLD', 'BRAVE', 'SMART', 'CLOWN', 'HOUSE', 'APPLE'],
  medium: ['PUZZLE', 'KNIGHT', 'FLAME', 'DRONE', 'CHASE', 'GLIDE', 'SPARK'],
  hard: ['RHYTHM', 'ZEPHYR', 'QUARTZ', 'JIGSAW', 'SPHINX', 'WALTZ', 'GLYPH']
};

// Expanded dictionary for word validation (partial list for demonstration)
const VALID_WORDS = new Set([
  ...WORD_LISTS.easy, 
  ...WORD_LISTS.medium, 
  ...WORD_LISTS.hard,
  'QUICK', 'MOVIE', 'CARDS', 'POKER', 'GAME'
]);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    margin: '0 auto',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  tile: {
    width: 60,
    height: 60,
    border: '2px solid #ccc',
    margin: theme.spacing(0.5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
  },
  correct: {
    backgroundColor: '#6aaa64',
    color: 'white',
    border: 'none',
  },
  present: {
    backgroundColor: '#c9b458',
    color: 'white',
    border: 'none',
  },
  absent: {
    backgroundColor: '#787c7e',
    color: 'white',
    border: 'none',
  },
  keyboard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  keyboardRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
  key: {
    margin: theme.spacing(0.25),
    padding: theme.spacing(1),
    minWidth: 40,
    backgroundColor: '#d3d6da',
    border: 'none',
    borderRadius: 4,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
}));

const WordleGame = () => {
  const classes = useStyles();
  const [dailyWord, setDailyWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null).map(() => Array(5).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Initialize daily word
  useEffect(() => {
    const today = new Date();
    const seedIndex = today.getDate() % WORD_LISTS.medium.length;
    setDailyWord(WORD_LISTS.medium[seedIndex].toUpperCase());
  }, []);

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing') return;

    if (/^[A-Z]$/.test(key) && currentCol < 5) {
      const newGuesses = [...guesses];
      newGuesses[currentRow][currentCol] = key;
      setGuesses(newGuesses);
      setCurrentCol(prev => Math.min(prev + 1, 4));
    } else if (key === 'BACKSPACE' && currentCol > 0) {
      const newGuesses = [...guesses];
      newGuesses[currentRow][currentCol - 1] = '';
      setGuesses(newGuesses);
      setCurrentCol(prev => Math.max(prev - 1, 0));
    } else if (key === 'ENTER' && currentCol === 5) {
      submitGuess();
    }
  }, [currentRow, currentCol, guesses, dailyWord, gameStatus]);

  const submitGuess = () => {
    const currentGuess = guesses[currentRow].join('');
    
    // Validate word
    if (currentGuess.length !== 5) return;

    if (!VALID_WORDS.has(currentGuess)) {
      alert('Not a valid word');
      return;
    }

    // Check if word matches
    if (currentGuess === dailyWord) {
      setGameStatus('won');
      setModalMessage('Congratulations! You guessed the word!');
      setOpenModal(true);
      return;
    }

    // Move to next row
    if (currentRow === 5) {
      setGameStatus('lost');
      setModalMessage(`Game Over! The word was ${dailyWord}.`);
      setOpenModal(true);
      return;
    }

    setCurrentRow(prev => prev + 1);
    setCurrentCol(0);
  };

  const getTileClass = (rowIndex, colIndex) => {
    if (rowIndex > currentRow) return classes.tile;
    if (rowIndex < currentRow) {
      const guess = guesses[rowIndex];
      const letter = guess[colIndex];
      
      if (letter === dailyWord[colIndex]) {
        return `${classes.tile} ${classes.correct}`;
      }
      if (dailyWord.includes(letter)) {
        return `${classes.tile} ${classes.present}`;
      }
      return `${classes.tile} ${classes.absent}`;
    }
    return classes.tile;
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Wordle Clone
      </Typography>
      
      <Grid container spacing={2} className={classes.grid}>
        {guesses.map((row, rowIndex) => (
          <div key={rowIndex} className={classes.row}>
            {row.map((letter, colIndex) => (
              <Paper 
                key={colIndex} 
                className={getTileClass(rowIndex, colIndex)}
              >
                {letter}
              </Paper>
            ))}
          </div>
        ))}
      </Grid>

      <div className={classes.keyboard}>
        {keyboard.map((row, rowIndex) => (
          <div key={rowIndex} className={classes.keyboardRow}>
            {row.map((key) => (
              <Button 
                key={key} 
                className={classes.key}
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          {gameStatus === 'won' ? 'Congratulations!' : 'Game Over'}
        </DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WordleGame;