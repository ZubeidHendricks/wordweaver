const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  letters: [String],
  words: [String],
  difficulty: Number,
  theme: String,
});

module.exports = mongoose.model('Game', GameSchema);