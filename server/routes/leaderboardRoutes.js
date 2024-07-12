const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

router.get('/', async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ highScore: -1 })
      .limit(10)
      .select('username highScore -_id');
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
});

module.exports = router;