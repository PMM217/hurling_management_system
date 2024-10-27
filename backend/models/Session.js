const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendance: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      managerMarked: { type: Boolean, default: false },
      playerMarked: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model('Session', sessionSchema);
