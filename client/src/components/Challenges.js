// client/src/components/Challenges.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Challenges = ({ user, showNotification }) => {
  const [pendingChallenges, setPendingChallenges] = useState([]);

  useEffect(() => {
    fetchPendingChallenges();
  }, []);

  const fetchPendingChallenges = async () => {
    try {
      const { data } = await axios.get('/api/challenges/pending');
      setPendingChallenges(data);
    } catch (error) {
      showNotification('Error fetching challenges', 'error');
    }
  };

  const acceptChallenge = async (challengeId) => {
    try {
      await axios.post(`/api/challenges/accept/${challengeId}`);
      fetchPendingChallenges();
      showNotification('Challenge accepted', 'success');
    } catch (error) {
      showNotification('Error accepting challenge', 'error');
    }
  };

  // Render pending challenges and accept button
  // ...
};

export default Challenges;