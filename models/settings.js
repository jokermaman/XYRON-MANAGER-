const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  guildId: String,
  welcomeChannel: String,
  autoRole: String,
  ticketCategory: String,
  logChannel: String,
  embedColor: { type: String, default: "#2f3136" },
  questions: { type: Array, default: [] }
});

module.exports = mongoose.model('Settings', schema);