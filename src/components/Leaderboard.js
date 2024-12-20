import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Avatar,
  Chip,
  CircularProgress,
  Button,
  Badge
} from '@material-ui/core';
import { EmojiEvents, Schedule, Public, Grade, LocalFireDepartment } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    maxHeight: 440,
  },
  row: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
  },
  rankCell: {
    width: 80,
    textAlign: 'center',
  },
  avatar: {
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    animation: '$pulse 2s infinite',
  },
  playerCell: {
    display: 'flex',
    alignItems: 'center',
  },
  achievement: {
    marginLeft: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  streakBadge: {
    marginLeft: theme.spacing(1),
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}));

const MOCK_DATA = {
  daily: [
    { id: 1, name: 'WordMaster', score: 2500, achievements: 8, streak: 12, ranking: 'Elite' },
    { id: 2, name: 'Lexicon', score: 2200, achievements: 6, streak: 8, ranking: 'Pro' },
    { id: 3, name: 'WordWizard', score: 2100, achievements: 5, streak: 7, ranking: 'Expert' },
    { id: 4, name: 'Spellbound', score: 2000, achievements: 4, streak: 6, ranking: 'Advanced' },
    { id: 5, name: 'Scrabbler', score: 1900, achievements: 3, streak: 5, ranking: 'Intermediate' },
  ],
  weekly: [
    { id: 1, name: 'VocabKing', score: 15000, achievements: 15, streak: 30, ranking: 'Legend' },
    { id: 2, name: 'Wordsmith', score: 12500, achievements: 12, streak: 25, ranking: 'Elite' },
    { id: 3, name: 'Linguist', score: 11000, achievements: 10, streak: 20, ranking: 'Master' },
    { id: 4, name: 'Polyglot', score: 10000, achievements: 8, streak: 15, ranking: 'Expert' },
    { id: 5, name: 'Scholar', score: 9000, achievements: 6, streak: 10, ranking: 'Pro' },
  ],
  allTime: [
    { id: 1, name: 'Legend', score: 50000, achievements: 25, streak: 50, ranking: 'Ultimate' },
    { id: 2, name: 'Champion', score: 45000, achievements: 22, streak: 45, ranking: 'Legend' },
    { id: 3, name: 'Master', score: 40000, achievements: 20, streak: 40, ranking: 'Elite' },
    { id: 4, name: 'Expert', score: 35000, achievements: 18, streak: 35, ranking: 'Master' },
    { id: 5, name: 'Veteran', score: 30000, achievements: 16, streak: 30, ranking: 'Pro' },
  ],
};

const getRankingColor = (ranking) => {
  const colors = {
    Ultimate: '#FF4081',
    Legend: '#AA00FF',
    Elite: '#2962FF',
    Master: '#00C853',
    Pro: '#FF6D00',
    Expert: '#FFD600',
    Advanced: '#3D5AFE',
    Intermediate: '#00B8D4',
  };
  return colors[ranking] || '#757575';
};

const LeaderboardTabs = {
  DAILY: 0,
  WEEKLY: 1,
  ALL_TIME: 2,
};

const Leaderboard = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(LeaderboardTabs.DAILY);
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(MOCK_DATA);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const getCurrentData = () => {
    switch (tab) {
      case LeaderboardTabs.DAILY:
        return leaderboardData.daily;
      case LeaderboardTabs.WEEKLY:
        return leaderboardData.weekly;
      case LeaderboardTabs.ALL_TIME:
        return leaderboardData.allTime;
      default:
        return [];
    }
  };

  const renderRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Grade style={{ color: '#FFD700', animation: 'pulse 2s infinite' }} />;
      case 2:
        return <Grade style={{ color: '#C0C0C0' }} />;
      case 3:
        return <Grade style={{ color: '#CD7F32' }} />;
      default:
        return rank;
    }
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4" component="h1">
          Leaderboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EmojiEvents />}
        >
          View Your Rank
        </Button>
      </div>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab icon={<Schedule />} label="Daily" />
        <Tab icon={<Schedule />} label="Weekly" />
        <Tab icon={<Public />} label="All Time" />
      </Tabs>

      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.rankCell}>Rank</TableCell>
                <TableCell>Player</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="center">Ranking</TableCell>
                <TableCell align="right">Streak</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCurrentData().map((player, index) => (
                <TableRow 
                  key={player.id} 
                  className={classes.row}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <TableCell className={classes.rankCell}>
                    {renderRankIcon(index + 1)}
                  </TableCell>
                  <TableCell>
                    <div className={classes.playerCell}>
                      <Avatar className={classes.avatar}>
                        {player.name[0]}
                      </Avatar>
                      {player.name}
                      {player.achievements >= 10 && (
                        <Chip
                          size="small"
                          label="Elite"
                          color="secondary"
                          className={classes.achievement}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {player.score.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={player.ranking}
                      style={{ 
                        backgroundColor: getRankingColor(player.ranking),
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Badge
                      badgeContent={player.streak}
                      color="secondary"
                      className={classes.streakBadge}
                      showZero
                    >
                      <LocalFireDepartment color="error" />
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default Leaderboard;