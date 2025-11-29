const mongoose = require('mongoose');
const crypto = require('crypto');

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true }
});

// Genera un código único antes de guardar si no existe
ticketSchema.pre('save', function(next) {
  if (this.code) return next();

  // Generar un código aleatorio hex de 16 bytes (32 chars)
  this.code = crypto.randomBytes(16).toString('hex');
  return next();
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
