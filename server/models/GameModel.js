const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  letters: [String],
  words: [String],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  date: { type: Date, default: Date.now },
  adRewardsAvailable: { type: Number, default: 5 },
  adRewardsUsed: { type: Number, default: 0 },
});

module.exports = mongoose.model('Game', GameSchema);