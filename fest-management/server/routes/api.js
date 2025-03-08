const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const stripe = require('stripe')('your-stripe-secret-key');

// Event Listing
router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Participant Registration & Ticket Booking
router.post('/register', async (req, res) => {
  const { userId, eventId } = req.body;
  const event = await Event.findById(eventId);
  if (event.ticketsAvailable > 0) {
    event.ticketsAvailable -= 1;
    event.participants.push(userId);
    await event.save();
    const user = await User.findById(userId);
    user.registeredEvents.push(eventId);
    await user.save();
    res.json({ message: 'Registered successfully' });
  } else {
    res.status(400).json({ message: 'No tickets available' });
  }
});

// Quiz Submission
router.post('/quiz', async (req, res) => {
  const { userId, eventId, score } = req.body;
  const user = await User.findById(userId);
  user.quizScores.push({ eventId, score });
  await user.save();
  res.json({ message: 'Score submitted' });
});

module.exports = router;