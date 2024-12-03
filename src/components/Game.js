import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  textField: {
    margin: theme.spacing(1),
    width: '100%',
    maxWidth: '300px',
  },
  lettersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  letter: {
    padding: theme.spacing(1),
    minWidth: '40px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&.used': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  wordsContainer: {
    maxHeight: '200px',
    overflow: 'auto',
    margin: theme.spacing(2, 0),
  },
  timer: {
    color: ({ timeLeft }) => timeLeft <= 10 ? theme.palette.error.main : 'inherit',
    fontWeight: ({ timeLeft }) => timeLeft <= 10 ? 'bold' : 'normal',
  },
}));

const Game = ({ user, showNotification }) => {
  const initialState = {
    score: 0,
    level: 1,
    currentWord: '',
    isPlaying: false,
    letters: [],
    usedLetters: {},
    timeLeft: 60,
    words: [],
    levelTarget: 100,
  };

  const [gameState, setGameState] = useState(initialState);
  const classes = useStyles({ timeLeft: gameState.timeLeft });

  const generateLetters = useCallback(() => {
    const vowels = 'AEIOU'.split('');
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');
    const letters = [];
    
    // Add vowels (increases with level)
    const numVowels = Math.min(3 + Math.floor(gameState.level / 3), 6);
    for (let i = 0; i < numVowels; i++) {
      letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    
    // Add consonants
    const numConsonants = 9 - numVowels;
    for (let i = 0; i < numConsonants; i++) {
      letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }
    
    return letters.sort(() => Math.random() - 0.5);
  }, [gameState.level]);

  const startGame = () => {
    const newLetters = generateLetters();
    setGameState({
      ...initialState,
      isPlaying: true,
      letters: newLetters,
      level: gameState.level,
      levelTarget: 100 * gameState.level,
    });
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  const endGame = async () => {
    const levelCompleted = gameState.score >= gameState.levelTarget;
    const newLevel = levelCompleted ? gameState.level + 1 : gameState.level;

    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      level: newLevel,
    }));

    // Save score to backend
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          score: gameState.score,
          level: gameState.level,
          words: gameState.words,
        }),
      });
    } catch (error) {
      console.error('Error saving score:', error);
    }

    if (levelCompleted) {
      showNotification(`Congratulations! Level ${gameState.level} completed!`, 'success');
    } else {
      showNotification(`Game Over! Score: ${gameState.score}`, 'info');
    }
  };

  const isWordValid = (word) => {
    if (word.length < 3) {
      showNotification('Word must be at least 3 letters long', 'error');
      return false;
    }

    if (gameState.words.includes(word)) {
      showNotification('Word already used', 'error');
      return false;
    }

    const letterCount = {};
    gameState.letters.forEach(letter => {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    for (const letter of word) {
      if (!letterCount[letter]) {
        showNotification('Invalid letters used', 'error');
        return false;
      }
      letterCount[letter]--;
    }

    return true;
  };

  const handleWordSubmit = async () => {
    const word = gameState.currentWord.toUpperCase();
    
    if (!isWordValid(word)) {
      return;
    }

    try {
      // Validate word with dictionary API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (!response.ok || !data.length) {
        showNotification('Not a valid English word', 'error');
        return;
      }

      // Calculate score based on word length and level
      const wordScore = word.length * (10 + gameState.level);

      setGameState(prev => ({
        ...prev,
        currentWord: '',
        score: prev.score + wordScore,
        words: [...prev.words, word],
      }));

      showNotification(`+${wordScore} points!`, 'success');

    } catch (error) {
      console.error('Error validating word:', error);
      showNotification('Error validating word', 'error');
    }
  };

  // Handle letter click
  const handleLetterClick = (letter) => {
    if (gameState.currentWord.length < 15) {
      setGameState(prev => ({
        ...prev,
        currentWord: prev.currentWord + letter,
      }));
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4" gutterBottom>
              Word Weaver
            </Typography>
            <Typography variant="h6" gutterBottom>
              Level: {gameState.level} | Score: {gameState.score}/{gameState.levelTarget}
            </Typography>
            <Typography variant="h6" className={classes.timer}>
              Time: {gameState.timeLeft}s
            </Typography>

            {!gameState.isPlaying ? (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={startGame}
              >
                {gameState.words.length ? 'Play Again' : 'Start Game'}
              </Button>
            ) : (
              <>
                <div className={classes.lettersContainer}>
                  {gameState.letters.map((letter, index) => (
                    <Paper
                      key={index}
                      className={classes.letter}
                      onClick={() => handleLetterClick(letter)}
                    >
                      {letter}
                    </Paper>
                  ))}
                </div>

                <TextField
                  className={classes.textField}
                  variant="outlined"
                  label="Enter word"
                  value={gameState.currentWord}
                  onChange={(e) => setGameState({
                    ...gameState,
                    currentWord: e.target.value.toUpperCase(),
                  })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && gameState.currentWord) {
                      handleWordSubmit();
                    }
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleWordSubmit}
                  disabled={!gameState.currentWord}
                >
                  Submit Word
                </Button>

                <div className={classes.wordsContainer}>
                  <Typography variant="h6" gutterBottom>
                    Words Found:
                  </Typography>
                  <List dense>
                    {gameState.words.map((word, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={word}
                          secondary={`+${word.length * (10 + gameState.level)} points`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Game;