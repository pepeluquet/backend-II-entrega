const mongoose = require('mongoose');
const crypto = require('crypto');

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true, min: 0 },
  purchaser: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }
  }],
  status: { 
    type: String, 
    enum: ['completed', 'partial', 'failed'], 
    default: 'completed' 
  },
  failedProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    requestedQuantity: Number,
    availableStock: Number,
    reason: String
  }]
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Genera un código único antes de guardar si no existe
ticketSchema.pre('save', function(next) {
  if (this.code) return next();

  // Generar un código aleatorio hex de 16 bytes (32 chars)
  this.code = crypto.randomBytes(16).toString('hex');
  return next();
});

// Índice para búsquedas rápidas por purchaser
ticketSchema.index({ purchaser: 1, purchase_datetime: -1 });

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
