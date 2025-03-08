const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // In production, hash this with bcrypt
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  quizScores: [{ eventId: String, score: Number }],
});

module.exports = mongoose.model('User', userSchema);