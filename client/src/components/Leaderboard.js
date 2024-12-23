import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
  const [leaderboardData] = useState([
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