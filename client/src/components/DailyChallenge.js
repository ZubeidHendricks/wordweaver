// client/src/components/DailyChallenge.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, CircularProgress } from '@material-ui/core';
import Game from './game';

const DailyChallenge = ({ user, showNotification }) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  const fetchDailyChallenge = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/game/daily-challenge');
      setChallenge(data);
    } catch (error) {
      showNotification('Error fetching daily challenge', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4">Daily Challenge</Typography>
      {challenge ? (
        <Game gameData={challenge} isDaily={true} user={user} showNotification={showNotification} />
      ) : (
        <Typography>No daily challenge available. Check back tomorrow!</Typography>
      )}
    </div>
  );
};

export default DailyChallenge;