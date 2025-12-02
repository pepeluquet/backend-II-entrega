const TicketModel = require('../models/ticket.model');

class TicketService {
  constructor(ticketModel = TicketModel) {
    this.ticketModel = ticketModel;
  }

  /**
   * Crea un ticket con amount, purchaser y productos.
   * El campo `code` y `purchase_datetime` se generan automáticamente.
   * @param {{ amount: Number, purchaser: String, products: Array, status: String, failedProducts: Array }} ticketData
   * @returns {Object} ticket creado
   */
  async createTicket(ticketData) {
    try {
      const { amount, purchaser, products = [], status = 'completed', failedProducts = [] } = ticketData;
      
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Amount debe ser un número mayor o igual a 0');
      }
      if (!purchaser || typeof purchaser !== 'string') {
        throw new Error('Purchaser requerido y debe ser un string');
      }

      // Validar productos si se proporcionan
      if (products.length > 0) {
        for (const product of products) {
          if (!product.productId || !product.title || !product.quantity || !product.price) {
            throw new Error('Productos deben tener productId, title, quantity y price');
          }
          // Calcular subtotal si no viene
          if (!product.subtotal) {
            product.subtotal = product.price * product.quantity;
          }
        }
      }

      const ticket = new this.ticketModel({ 
        amount, 
        purchaser, 
        products,
        status,
        failedProducts
      });
      
      const saved = await ticket.save();
      return saved.toObject();
    } catch (err) {
      throw new Error(`Error creando ticket: ${err.message}`);
    }
  }

  /**
   * Obtiene un ticket por su código
   */
  async getTicketByCode(code) {
    try {
      return await this.ticketModel.findOne({ code }).populate('products.productId').lean();
    } catch (err) {
      throw new Error(`Error obteniendo ticket: ${err.message}`);
    }
  }

  /**
   * Obtiene todos los tickets de un comprador
   */
  async getTicketsByPurchaser(purchaser) {
    try {
      return await this.ticketModel
        .find({ purchaser })
        .sort({ purchase_datetime: -1 })
        .populate('products.productId')
        .lean();
    } catch (err) {
      throw new Error(`Error obteniendo tickets: ${err.message}`);
    }
  }
}

module.exports = TicketService;
