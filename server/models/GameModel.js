const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  letters: [String],
  words: [String],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', GameSchema);