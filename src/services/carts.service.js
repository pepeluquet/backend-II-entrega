const TicketService = require('./ticket.services');

class CartsService {
  constructor(cartsDAO, productsDAO) {
    this.cartsDAO = cartsDAO;
    this.productsDAO = productsDAO;
    this.ticketService = new TicketService();
  }

  async createCart(userId = null) {
    if (!userId) {
      throw new Error('userId es requerido para crear un carrito');
    }
    return await this.cartsDAO.createCart(userId);
  }

  async getOrCreateCart(userId) {
    return await this.cartsDAO.getOrCreateCart(userId);
  }

  async getCartById(cartId) {
    return await this.cartsDAO.getCartById(cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    return await this.cartsDAO.addProduct(cartId, productId, quantity);
  }

  /**
   * Procesa la compra del carrito con verificación de stock robusta
   * - Verifica stock de cada producto
   * - Actualiza stock solo de productos disponibles
   * - Crea ticket con productos comprados y fallidos
   * - Actualiza el carrito dejando solo productos sin stock
   */
  async checkout(cartId, userEmail) {
    try {
      const cart = await this.cartsDAO.getCartById(cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      if (!cart.products || cart.products.length === 0) {
        throw new Error('El carrito está vacío');
      }

      let totalAmount = 0;
      const purchasedProducts = [];
      const failedProducts = [];

      // Procesar cada producto del carrito
      for (const item of cart.products) {
        try {
          // Obtener producto actualizado de la base de datos
          const product = await this.productsDAO.getProductById(item.productId);

          if (!product) {
            failedProducts.push({
              productId: item.productId,
              title: item.title || 'Producto desconocido',
              requestedQuantity: item.quantity,
              availableStock: 0,
              reason: 'Producto no encontrado'
            });
            continue;
          }

          // Verificar si el producto está activo
          if (product.status === false) {
            failedProducts.push({
              productId: item.productId,
              title: product.title,
              requestedQuantity: item.quantity,
              availableStock: product.stock,
              reason: 'Producto inactivo'
            });
            continue;
          }

          // Verificar stock disponible
          const requestedQuantity = item.quantity || 1;
          const availableStock = product.stock || 0;

          if (availableStock >= requestedQuantity) {
            // Stock suficiente: comprar todo
            await this.productsDAO.updateStock(item.productId, -requestedQuantity);
            
            const subtotal = product.price * requestedQuantity;
            totalAmount += subtotal;
            
            purchasedProducts.push({
              productId: item.productId,
              title: product.title,
              quantity: requestedQuantity,
              price: product.price,
              subtotal: subtotal
            });
          } else if (availableStock > 0) {
            // Stock parcial: comprar lo disponible
            await this.productsDAO.updateStock(item.productId, -availableStock);
            
            const subtotal = product.price * availableStock;
            totalAmount += subtotal;
            
            purchasedProducts.push({
              productId: item.productId,
              title: product.title,
              quantity: availableStock,
              price: product.price,
              subtotal: subtotal
            });

            // Agregar el resto a productos fallidos
            const remainingQuantity = requestedQuantity - availableStock;
            failedProducts.push({
              productId: item.productId,
              title: product.title,
              requestedQuantity: requestedQuantity,
              availableStock: 0, // Ya se agotó
              reason: `Stock insuficiente. Se compraron ${availableStock} unidades de ${requestedQuantity} solicitadas`
            });
          } else {
            // Sin stock
            failedProducts.push({
              productId: item.productId,
              title: product.title,
              requestedQuantity: requestedQuantity,
              availableStock: 0,
              reason: 'Sin stock disponible'
            });
          }
        } catch (error) {
          // Si hay error procesando un producto, agregarlo a fallidos
          failedProducts.push({
            productId: item.productId,
            title: item.title || 'Producto desconocido',
            requestedQuantity: item.quantity,
            availableStock: 0,
            reason: `Error al procesar: ${error.message}`
          });
        }
      }

      // Validar que se haya comprado al menos un producto
      if (purchasedProducts.length === 0) {
        throw new Error('No se pudo comprar ningún producto. Verifica el stock disponible.');
      }

      // Determinar el estado del ticket
      let ticketStatus = 'completed';
      if (failedProducts.length > 0 && purchasedProducts.length > 0) {
        ticketStatus = 'partial';
      } else if (purchasedProducts.length === 0) {
        ticketStatus = 'failed';
      }

      // Crear ticket con todos los datos
      const ticket = await this.ticketService.createTicket({
        amount: totalAmount,
        purchaser: userEmail,
        products: purchasedProducts,
        status: ticketStatus,
        failedProducts: failedProducts
      });

      // Actualizar el carrito: dejar solo productos que no se pudieron comprar
      if (failedProducts.length > 0) {
        // Reconstruir array de productos fallidos para el carrito
        const remainingCartProducts = failedProducts.map(failed => ({
          productId: failed.productId,
          quantity: failed.requestedQuantity - (purchasedProducts.find(p => p.productId.toString() === failed.productId.toString())?.quantity || 0),
          title: failed.title
        })).filter(item => item.quantity > 0);

        await this.cartsDAO.updateCart(cartId, { products: remainingCartProducts });
      } else {
        // Si todo se compró, vaciar el carrito
        await this.cartsDAO.clearCart(cartId);
      }

      return {
        ticket: {
          code: ticket.code,
          purchase_datetime: ticket.purchase_datetime,
          amount: ticket.amount,
          purchaser: ticket.purchaser,
          status: ticket.status
        },
        purchasedProducts,
        failedProducts,
        message: `Compra ${ticketStatus === 'completed' ? 'completada' : ticketStatus === 'partial' ? 'parcial' : 'fallida'}. ${purchasedProducts.length} producto(s) comprado(s). ${failedProducts.length} producto(s) sin stock suficiente.`
      };
    } catch (error) {
      throw new Error(`Error en checkout: ${error.message}`);
    }
  }

  /**
   * Alias para finalizePurchase (compatibilidad con controlador)
   */
  async finalizePurchase(cartId, purchaserEmail) {
    return await this.checkout(cartId, purchaserEmail);
  }
}

module.exports = CartsService;