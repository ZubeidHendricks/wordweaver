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
  Select,
  MenuItem
} from '@material-ui/core';

// Comprehensive word lists with varied difficulty
const WORD_LISTS = {
  easy: ['HELLO', 'WORLD', 'BRAVE', 'SMART', 'CLOWN', 'HOUSE', 'APPLE', 'BEACH'],
  medium: ['PUZZLE', 'KNIGHT', 'FLAME', 'DRONE', 'CHASE', 'GLIDE', 'SPARK', 'MUSIC'],
  hard: ['RHYTHM', 'ZEPHYR', 'QUARTZ', 'JIGSAW', 'SPHINX', 'WALTZ', 'GLYPH', 'CRYPT']
};

// Extended dictionary for word validation
const VALID_WORDS = new Set([
  ...WORD_LISTS.easy, 
  ...WORD_LISTS.medium, 
  ...WORD_LISTS.hard,
  'QUICK', 'MOVIE', 'CARDS', 'POKER', 'GAME', 'CODE'
]);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    margin: '0 auto',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  difficultySelect: {
    marginBottom: theme.spacing(2),
    minWidth: 120,
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
    transition: 'background-color 0.2s',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: theme.spacing(2),
  },
}));

const WordleGame = () => {
  const classes = useStyles();
  const [difficulty, setDifficulty] = useState('medium');
  const [dailyWord, setDailyWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null).map(() => Array(5).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Initialize game statistics from local storage
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('wordleStats');
    return savedStats ? JSON.parse(savedStats) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      winDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    };
  });

  // Initialize daily word based on date and difficulty
  useEffect(() => {
    const today = new Date();
    const wordList = WORD_LISTS[difficulty];
    const seedIndex = today.getDate() % wordList.length;
    setDailyWord(wordList[seedIndex].toUpperCase());
  }, [difficulty]);

  // Save stats to local storage
  useEffect(() => {
    localStorage.setItem('wordleStats', JSON.stringify(stats));
  }, [stats]);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    resetGame();
  };

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
    if (currentGuess.length !== 5) {
      alert('Word must be 5 letters long');
      return;
    }

    if (!VALID_WORDS.has(currentGuess)) {
      alert('Not a valid word');
      return;
    }

    // Check if word matches
    if (currentGuess === dailyWord) {
      const newStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        currentStreak: stats.currentStreak + 1,
        maxStreak: Math.max(stats.currentStreak + 1, stats.maxStreak),
        winDistribution: {
          ...stats.winDistribution,
          [currentRow + 1]: (stats.winDistribution[currentRow + 1] || 0) + 1
        }
      };
      setStats(newStats);
      
      setGameStatus('won');
      setModalMessage(`Congratulations! You guessed the word in ${currentRow + 1} tries!`);
      setOpenModal(true);
      return;
    }

    // Move to next row or end game
    if (currentRow === 5) {
      const newStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        currentStreak: 0
      };
      setStats(newStats);
      
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

  // Keyboard status tracking
  const keyboardStatus = useMemo(() => {
    const status = {};
    guesses.slice(0, currentRow + 1).forEach(guess => {
      guess.forEach((letter, index) => {
        if (letter === dailyWord[index]) {
          status[letter] = 'correct';
        } else if (dailyWord.includes(letter)) {
          status[letter] = status[letter] !== 'correct' ? 'present' : status[letter];
        } else {
          status[letter] = status[letter] || 'absent';
        }
      });
    });
    return status;
  }, [guesses, currentRow, dailyWord]);

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const resetGame = () => {
    setGuesses(Array(6).fill(null).map(() => Array(5).fill('')));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameStatus('playing');
    setOpenModal(false);
    
    // Select new daily word
    const today = new Date();
    const wordList = WORD_LISTS[difficulty];
    const seedIndex = today.getDate() % wordList.length;
    setDailyWord(wordList[seedIndex].toUpperCase());
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Wordle Clone
      </Typography>
      
      <Select
        value={difficulty}
        onChange={handleDifficultyChange}
        className={classes.difficultySelect}
      >
        <MenuItem value="easy">Easy</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="hard">Hard</MenuItem>
      </Select>

      <div className={classes.statsContainer}>
        <div>
          <Typography>Games: {stats.gamesPlayed}</Typography>
          <Typography>Won: {stats.gamesWon}</Typography>
        </div>
        <div>
          <Typography>Streak: {stats.currentStreak}</Typography>
          <Typography>Max Streak: {stats.maxStreak}</Typography>
        </div>
      </div>
      
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
            {row.map((key) => {
              const keyClass = (() => {
                switch(keyboardStatus[key]) {
                  case 'correct': return `${classes.key} ${classes.correct}`;
                  case 'present': return `${classes.key} ${classes.present}`;
                  case 'absent': return `${classes.key} ${classes.absent}`;
                  default: return classes.key;
                }
              })();

              return (
                <Button 
                  key={key} 
                  className={keyClass}
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </Button>
              );
            })}
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
          <Button onClick={resetGame} color="primary">
            Play Again
          </Button>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WordleGame;