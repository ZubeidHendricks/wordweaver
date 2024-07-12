const Game = require('../models/GameModel');

exports.getGame = async (req, res) => {
  try {
    const { difficulty } = req.query;
    let game = await Game.findOne({ difficulty });
    
    if (!game) {
      game = await generateGame(difficulty);
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error });
  }
};

const generateGame = async (difficulty) => {
  // Implement logic to generate a game based on difficulty
  // This is a simplified example
  const wordLengths = {
    easy: { min: 3, max: 5 },
    medium: { min: 4, max: 7 },
    hard: { min: 5, max: 9 }
  };
  
  const { min, max } = wordLengths[difficulty];
  
  // Generate words and letters based on difficulty
  // ... (implement word generation logic)
  
  return new Game({ difficulty, words, letters });
};
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
// server/controllers/gameController.js
exports.getDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let challenge = await Game.findOne({ date: today, isDaily: true });
    
    if (!challenge) {
      challenge = await generateDailyChallenge();
    }
    
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily challenge', error });
  }
};

// server/controllers/gameController.js
exports.getDailyChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let challenge = await Game.findOne({ date: today, isDaily: true });
    
    if (!challenge) {
      challenge = await generateDailyChallenge();
    }
    
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily challenge', error });
  }
};

const generateDailyChallenge = async () => {
  // Implement logic to generate a daily challenge
  // This should be more difficult and unique compared to regular games
  // ...
  
  return new Game({ isDaily: true, date: new Date().toISOString().split('T')[0], /* other fields */ });
};