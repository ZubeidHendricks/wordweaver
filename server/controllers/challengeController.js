const Challenge = require('../models/ChallengeModel');
const Game = require('../models/GameModel');

exports.createChallenge = async (req, res) => {
  try {
    const { challengedId } = req.body;
    const game = await Game.create(/* Generate a new game */);
    const challenge = await Challenge.create({
      challenger: req.user._id,
      challenged: challengedId,
      game: game._id,
    });
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error creating challenge', error });
  }
};

// Implement other controller methods...