const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  letters: [String],
  words: [String],
  difficulty: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', GameSchema);