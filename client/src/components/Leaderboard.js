import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  header: {
    marginBottom: theme.spacing(2),
  },
}));

const Leaderboard = () => {
  const classes = useStyles();
  const [leaderboardData, setLeaderboardData] = useState([
    { username: 'Player 1', score: 1000, rank: 1 },
    { username: 'Player 2', score: 850, rank: 2 },
    { username: 'Player 3', score: 720, rank: 3 },
  ]);

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.header}>
        Leaderboard
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((player) => (
              <TableRow key={player.rank}>
                <TableCell component="th" scope="row">
                  {player.rank}
                </TableCell>
                <TableCell>{player.username}</TableCell>
                <TableCell align="right">{player.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Leaderboard;