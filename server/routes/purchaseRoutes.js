const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

router.post('/hints', async (req, res) => {
  try {
    const { amount } = req.body;
    // In a real app, you'd process payment here
    const user = await User.findById(req.user._id);
    user.hints += amount;
    await user.save();
    res.json({ hintsAdded: amount });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;