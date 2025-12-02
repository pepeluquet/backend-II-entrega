const Ticket = require('../models/ticket.model');

class CartsService {
  constructor(cartsDAO, productsDAO) {
    this.cartsDAO = cartsDAO;
    this.productsDAO = productsDAO;
  }

  async getOrCreateCart(userId) {
    return await this.cartsDAO.getOrCreateCart(userId);
  }

  async addProductToCart(cartId, productId, quantity) {
    return await this.cartsDAO.addProduct(cartId, productId, quantity);
  }

  async checkout(cartId, userEmail) {
    try {
      const cart = await this.cartsDAO.getCartById(cartId);

      if (!cart || cart.products.length === 0) {
        throw new Error('El carrito está vacío');
      }

      let totalAmount = 0;
      const purchasedProducts = [];
      const failedProducts = [];

      for (const item of cart.products) {
        const product = await this.productsDAO.getProductById(item.productId);

        if (!product) {
          failedProducts.push({
            productId: item.productId,
            reason: 'Producto no encontrado'
          });
          continue;
        }

        if (product.stock >= item.quantity) {
          await this.productsDAO.updateStock(item.productId, -item.quantity);
          const subtotal = product.price * item.quantity;
          totalAmount += subtotal;
          purchasedProducts.push({
            productId: item.productId,
            title: product.title,
            quantity: item.quantity,
            price: product.price
          });
        } else {
          failedProducts.push({
            productId: item.productId,
            title: product.title,
            requestedQuantity: item.quantity,
            availableStock: product.stock
          });
        }
      }

      if (purchasedProducts.length === 0) {
        throw new Error('No se pudo comprar ningún producto por falta de stock');
      }

      const ticket = new Ticket({
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: userEmail,
        products: purchasedProducts
      });

      await ticket.save();

      if (failedProducts.length > 0) {
        const failedProductIds = failedProducts.map(p => p.productId);
        const updatedProducts = cart.products.filter(item =>
          failedProductIds.includes(item.productId.toString())
        );
        await this.cartsDAO.updateCart(cartId, { products: updatedProducts });
      } else {
        await this.cartsDAO.clearCart(cartId);
      }

      return {
        ticket: {
          code: ticket.code,
          purchase_datetime: ticket.purchase_datetime,
          amount: ticket.amount,
          purchaser: ticket.purchaser
        },
        purchasedProducts,
        failedProducts,
        message: `Compra finalizada. ${purchasedProducts.length} producto(s) comprado(s). ${failedProducts.length} producto(s) sin stock.`
      };
    } catch (error) {
      throw new Error(`Error en checkout: ${error.message}`);
    }
  }
}

module.exports = CartsService;