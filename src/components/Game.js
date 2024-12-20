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
  MenuItem,
  Tooltip,
  TextField,
  CircularProgress,
  Chip
} from '@material-ui/core';
import { 
  TranslateOutlined, 
  LeaderboardOutlined, 
  AddCircleOutline,
  Timer,
  EmojiEvents
} from '@material-ui/icons';

const DIFFICULTY_LEVELS = {
  EASY: { name: 'Easy', minLength: 3, maxLength: 5, timeLimit: 60, points: 10 },
  MEDIUM: { name: 'Medium', minLength: 6, maxLength: 8, timeLimit: 45, points: 20 },
  HARD: { name: 'Hard', minLength: 9, maxLength: 12, timeLimit: 30, points: 30 }
};

const CATEGORIES = [
  'Animals', 'Countries', 'Food', 'Sports', 'Technology', 'Nature'
];

const WORDS = {
  Animals: {
    EASY: ['cat', 'dog', 'rat', 'pig', 'owl'],
    MEDIUM: ['elephant', 'giraffe', 'penguin'],
    HARD: ['rhinoceros', 'hippopotamus']
  },
  Countries: {
    EASY: ['usa', 'uk', 'uae'],
    MEDIUM: ['germany', 'france', 'spain'],
    HARD: ['switzerland', 'kazakhstan']
  },
  // Add more categories...
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  gameArea: {
    minHeight: '400px',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  letterGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  letterBox: {
    width: '40px',
    height: '40px',
    margin: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
  },
  correct: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  incorrect: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  partial: {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  controls: {
    marginTop: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  timer: {
    marginLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  score: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  streak: {
    marginLeft: theme.spacing(1),
  }
}));

const Game = ({ showNotification }) => {
  const classes = useStyles();
  const [difficulty, setDifficulty] = useState('EASY');
  const [category, setCategory] = useState('Animals');
  const [currentWord, setCurrentWord] = useState('');
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_LEVELS[difficulty].timeLimit);
  const [gameActive, setGameActive] = useState(false);
  const [hints, setHints] = useState([]);
  const [hintCount, setHintCount] = useState(3);
  const [gameHistory, setGameHistory] = useState([]);

  // Initialize or load game state
  useEffect(() => {
    const savedScore = localStorage.getItem('wordweaver_score');
    if (savedScore) setScore(parseInt(savedScore));
    
    const savedStreak = localStorage.getItem('wordweaver_streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const generateNewWord = useCallback(() => {
    const words = WORDS[category][difficulty];
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setGuess('');
    setHints([]);
    setHintCount(3);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    setGameActive(true);
  }, [difficulty, category]);

  const handleGuessSubmit = () => {
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      const points = DIFFICULTY_LEVELS[difficulty].points;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      showNotification('Correct! Well done!', 'success');
      localStorage.setItem('wordweaver_score', score + points);
      localStorage.setItem('wordweaver_streak', streak + 1);
      setGameHistory((prev) => [...prev, { word: currentWord, success: true }]);
      generateNewWord();
    } else {
      setAttempts((prev) => prev + 1);
      setStreak(0);
      localStorage.setItem('wordweaver_streak', 0);
      showNotification('Try again!', 'error');
      setGameHistory((prev) => [...prev, { word: currentWord, success: false }]);
    }
  };

  const handleGameOver = () => {
    setGameActive(false);
    showNotification('Time's up! Game Over', 'info');
  };

  const generateHint = () => {
    if (hintCount <= 0) {
      showNotification('No more hints available!', 'warning');
      return;
    }

    const hintTypes = [
      `The word has ${currentWord.length} letters`,
      `The word starts with '${currentWord[0]}'`,
      `The word ends with '${currentWord[currentWord.length - 1]}'`,
      `The word contains the letter '${currentWord[Math.floor(currentWord.length / 2)]}'`
    ];

    const newHint = hintTypes[Math.floor(Math.random() * hintTypes.length)];
    if (!hints.includes(newHint)) {
      setHints((prev) => [...prev, newHint]);
      setHintCount((prev) => prev - 1);
    } else {
      generateHint(); // Try again if we got a duplicate hint
    }
  };

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Word Weaver
          </Typography>
          
          <div className={classes.controls}>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              variant="outlined"
            >
              {Object.keys(DIFFICULTY_LEVELS).map((level) => (
                <MenuItem key={level} value={level}>
                  {DIFFICULTY_LEVELS[level].name}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="outlined"
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              color="primary"
              onClick={() => generateNewWord()}
              disabled={gameActive}
            >
              New Game
            </Button>

            <Tooltip title={`${hintCount} hints remaining`}>
              <span>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={generateHint}
                  disabled={!gameActive || hintCount <= 0}
                >
                  Get Hint
                </Button>
              </span>
            </Tooltip>

            <div className={classes.timer}>
              <Timer />
              <Typography variant="h6" style={{ marginLeft: '8px' }}>
                {timeLeft}s
              </Typography>
            </div>
          </div>

          <div className={classes.gameArea}>
            {gameActive ? (
              <>
                <div className={classes.letterGrid}>
                  {currentWord.split('').map((_, index) => (
                    <Paper
                      key={index}
                      className={classes.letterBox}
                    >
                      {guess[index] || ''}
                    </Paper>
                  ))}
                </div>

                <TextField
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  variant="outlined"
                  label="Your guess"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuessSubmit()}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGuessSubmit}
                  style={{ marginTop: '16px' }}
                >
                  Submit
                </Button>

                {hints.map((hint, index) => (
                  <Chip
                    key={index}
                    label={hint}
                    style={{ margin: '8px' }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </>
            ) : (
              <Typography variant="h5">
                Press 'New Game' to start!
              </Typography>
            )}
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.score}>
            <Typography variant="h6">
              Score: {score}
              <Tooltip title="Current streak">
                <Chip
                  icon={<EmojiEvents />}
                  label={`${streak} streak`}
                  color="secondary"
                  className={classes.streak}
                />
              </Tooltip>
            </Typography>
          </Paper>

          <div style={{ marginTop: '16px' }}>
            <Typography variant="h6" gutterBottom>
              Recent Games:
            </Typography>
            {gameHistory.slice(-5).map((game, index) => (
              <Chip
                key={index}
                label={game.word}
                className={classes[game.success ? 'correct' : 'incorrect']}
                style={{ margin: '4px' }}
              />
            ))}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Game;
