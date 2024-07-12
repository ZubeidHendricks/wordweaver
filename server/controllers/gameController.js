const Game = require('../models/GameModel');

exports.getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let game = await Game.findOne({ date: { $gte: today } });
    
    if (!game) {
      // If no game for today, create a new one (you'll need to implement game generation logic)
      game = await Game.create({
        letters: ['W', 'O', 'R', 'D', 'S', 'C', 'A', 'P', 'E'],
        words: ['WORD', 'SCORE', 'CAPE', 'PACE'],
        difficulty: 1,
      });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily challenge', error });
  }
};