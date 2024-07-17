const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challenged: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  challengerScore: Number,
  challengedScore: Number,
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Challenge', ChallengeSchema);