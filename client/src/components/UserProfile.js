import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, Grid, Avatar } from '@material-ui/core';

const UserProfile = ({ user, showNotification }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data } = await axios.get('/api/user/stats');
      setStats(data);
    } catch (error) {
      showNotification('Error fetching user stats', 'error');
    }
  };

  if (!stats) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Avatar alt={user.username} src={user.avatar} style={{ width: 60, height: 60 }} />
        </Grid>
        <Grid item>
          <Typography variant="h4">{user.username}</Typography>
        </Grid>
      </Grid>
      <Typography variant="h6" style={{ marginTop: '20px' }}>Statistics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Games Played: {stats.gamesPlayed}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Win Rate: {stats.winRate}%</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Average Score: {stats.averageScore}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Highest Score: {stats.highestScore}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfile;