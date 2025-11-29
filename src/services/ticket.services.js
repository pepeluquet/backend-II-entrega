const TicketModel = require('../models/ticket.model');

class TicketService {
  constructor(ticketModel = TicketModel) {
    this.ticketModel = ticketModel;
  }

  /**
   * Crea un ticket con amount y purchaser.
   * El campo `code` y `purchase_datetime` se generan en el modelo (hook pre-save).
   * @param {{ amount: Number, purchaser: String }} ticketData
   * @returns {Object} ticket creado
   */
  async createTicket(ticketData) {
    try {
      const { amount, purchaser } = ticketData;
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Amount inválido');
      }
      if (!purchaser) {
        throw new Error('Purchaser requerido');
      }

      const ticket = new this.ticketModel({ amount, purchaser });
      const saved = await ticket.save();
      return saved.toObject();
    } catch (err) {
      throw new Error(`Error creando ticket: ${err.message}`);
    }
  }
}

module.exports = TicketService;
