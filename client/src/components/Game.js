import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Game = () => {
  const classes = useStyles();
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    isPlaying: false,
  });

  const startGame = () => {
    setGameState({
      ...gameState,
      isPlaying: true,
    });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4">
              WordWeaver
            </Typography>
            <Typography variant="h6">
              Level: {gameState.level} | Score: {gameState.score}
            </Typography>
            {!gameState.isPlaying && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={startGame}
              >
                Start Game
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Game;