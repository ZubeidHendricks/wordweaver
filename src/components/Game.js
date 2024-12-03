import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
  },
}));

const Game = ({ user, showNotification }) => {
  const classes = useStyles();
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    currentWord: '',
    isPlaying: false,
    letters: [],
    timeLeft: 60,
  });

  const startGame = () => {
    const newLetters = generateLetters();
    setGameState({
      ...gameState,
      isPlaying: true,
      letters: newLetters,
      currentWord: '',
      score: 0,
      timeLeft: 60,
    });
  };

  const generateLetters = () => {
    const vowels = 'AEIOU'.split('');
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');
    const letters = [];
    
    // Add 3 vowels
    for (let i = 0; i < 3; i++) {
      letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    
    // Add 6 consonants
    for (let i = 0; i < 6; i++) {
      letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }
    
    // Shuffle letters
    return letters.sort(() => Math.random() - 0.5);
  };

  const handleWordSubmit = () => {
    // TODO: Validate word
    setGameState({
      ...gameState,
      currentWord: '',
      score: gameState.score + gameState.currentWord.length,
    });
    showNotification('Word submitted!', 'success');
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4">
              Word Weaver
            </Typography>
            <Typography variant="h6">
              Level: {gameState.level} | Score: {gameState.score} | Time: {gameState.timeLeft}s
            </Typography>
            {!gameState.isPlaying ? (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={startGame}
              >
                Start Game
              </Button>
            ) : (
              <>
                <div className={classes.lettersContainer}>
                  {gameState.letters.map((letter, index) => (
                    <Paper key={index} className={classes.letter}>
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
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Game;