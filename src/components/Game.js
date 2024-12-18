import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@material-ui/core';

// Word list for daily challenges
const WORD_LIST = [
  'HELLO', 'WORLD', 'BRAVE', 'SMART', 'CLOWN', 
  'DRONE', 'FLAME', 'GLIDE', 'HOUSE', 'IMAGE'
];

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
    transition: 'background-color 0.3s',
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  keyboardRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
  key: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    minWidth: 40,
    backgroundColor: '#d3d6da',
    border: 'none',
    borderRadius: 4,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#bbb',
    },
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
    // Use date to select consistent daily word
    const today = new Date();
    const seedIndex = today.getDate() % WORD_LIST.length;
    setDailyWord(WORD_LIST[seedIndex]);
  }, []);

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing') return;

    if (/^[A-Z]$/.test(key) && currentCol < 5) {
      // Letter input
      const newGuesses = [...guesses];
      newGuesses[currentRow][currentCol] = key;
      setGuesses(newGuesses);
      setCurrentCol(prev => Math.min(prev + 1, 4));
    } else if (key === 'BACKSPACE' && currentCol > 0) {
      // Backspace
      const newGuesses = [...guesses];
      newGuesses[currentRow][currentCol - 1] = '';
      setGuesses(newGuesses);
      setCurrentCol(prev => Math.max(prev - 1, 0));
    } else if (key === 'ENTER' && currentCol === 5) {
      // Submit guess
      submitGuess();
    }
  }, [currentRow, currentCol, guesses, dailyWord, gameStatus]);

  const submitGuess = () => {
    const currentGuess = guesses[currentRow].join('');
    
    // Check if guess is valid (you could add dictionary check here)
    if (currentGuess.length !== 5) return;

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
    if (rowIndex >= currentRow) return classes.tile;
    
    const guess = guesses[rowIndex];
    const letter = guess[colIndex];
    
    if (letter === dailyWord[colIndex]) {
      return `${classes.tile} ${classes.correct}`;
    }
    if (dailyWord.includes(letter)) {
      return `${classes.tile} ${classes.present}`;
    }
    return `${classes.tile} ${classes.absent}`;
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