const Cart = require('../models/cart.model');

class CartsDAO {
  async createCart(userId) {
    const cart = new Cart({ userId, products: [] });
    return await cart.save();
  }

  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.productId');
  }

  async getOrCreateCart(userId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await this.createCart(userId);
    }
    return cart;
  }

  async addProduct(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const existingProduct = cart.products.find(p => p.productId.toString() === productId.toString());
    
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    cart.updatedAt = new Date();
    return await cart.save();
  }

  async removeProduct(cartId, productId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { productId } }, updatedAt: new Date() },
      { new: true }
    );
  }

  async updateCart(cartId, updateData) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  async clearCart(cartId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { products: [], updatedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = CartsDAO;