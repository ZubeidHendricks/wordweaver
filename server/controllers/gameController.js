const Game = require('../models/game');

exports.getGameData = async (req, res) => {
  try {
    const gameData = await Game.findOne().sort({ createdAt: -1 });
    res.json(gameData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game data', error });
  }
};