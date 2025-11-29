const ProductModel = require('../models/product.model.js');

class CartService {
    constructor(cartDao, ticketService = null) {
        this.cartDao = cartDao;
        this.ticketService = ticketService; // instancia de TicketService inyectada
    }

    async createCart() {
        return await this.cartDao.createCart();
    }

    async getCartProducts(cartId) {
        const cart = await this.cartDao.getCartById(cartId);
        return cart ? cart.products : null;
    }

    async addProductToCart(cartId, productId) {
        return await this.cartDao.addProductToCart(cartId, productId);
    }

    async getCartById(cartId) {
        return await this.cartDao.getCartById(cartId);
    }

    async removeProductFromCart(cartId, productId) {
        return await this.cartDao.removeProductFromCart(cartId, productId);
    }

    async replaceCartProducts(cartId, products) {
        return await this.cartDao.replaceCartProducts(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await this.cartDao.updateProductQuantity(cartId, productId, quantity);
    }

    async clearCart(cartId) {
        return await this.cartDao.clearCart(cartId);
    }

    /**
     * Procesa la compra del carrito teniendo en cuenta stock disponible.
     * - Si un producto tiene stock suficiente, se descuenta la cantidad comprada.
     * - Si un producto tiene stock parcial, se compra la parte disponible y se deja el resto en el carrito.
     * - Si no tiene stock, se deja entero en el carrito.
     * Al final crea un ticket por el monto realmente comprado y actualiza el carrito
     * dejando solo los productos (o las cantidades) que no pudieron comprarse por falta de stock.
     * @param {String} cartId
     * @param {String} purchaserEmail
     */
    async processPurchase(cartId, purchaserEmail) {
        if (!this.ticketService) throw new Error('TicketService no inyectado');

        const cart = await this.getCartById(cartId);
        if (!cart) return null;

        const products = cart.products || [];
        if (products.length === 0) {
            return { status: 'error', message: 'Carrito vacío' };
        }

        let total = 0;
        const outOfStock = []; // items (or remainders) that couldn't be purchased
        const purchasedItems = [];

        for (const item of products) {
            const prod = item.product;
            const qty = item.quantity || 0;

            if (!prod || typeof prod.price !== 'number' || typeof prod.stock !== 'number') {
                throw new Error('Producto inválido en carrito');
            }

            if (prod.stock <= 0) {
                // nada disponible, dejar todo en carrito
                outOfStock.push({ product: prod._id, quantity: qty });
                continue;
            }

            if (prod.stock >= qty) {
                // comprar todo
                const purchasedQty = qty;
                await ProductModel.findByIdAndUpdate(prod._id, { $inc: { stock: -purchasedQty } });
                total += prod.price * purchasedQty;
                purchasedItems.push({ product: prod._id, quantity: purchasedQty });
            } else {
                // stock parcial: comprar lo que hay, dejar el resto en el carrito
                const purchasedQty = prod.stock;
                const remainder = qty - purchasedQty;
                await ProductModel.findByIdAndUpdate(prod._id, { $inc: { stock: -purchasedQty } });
                total += prod.price * purchasedQty;
                purchasedItems.push({ product: prod._id, quantity: purchasedQty });
                outOfStock.push({ product: prod._id, quantity: remainder });
            }
        }

        if (purchasedItems.length === 0) {
            return { status: 'error', message: 'No hay productos con stock suficiente', outOfStock };
        }

        // Crear ticket por el monto comprado
        const ticket = await this.ticketService.createTicket({ amount: total, purchaser: purchaserEmail });

        // Reemplazar el carrito dejando solo los productos (o cantidades) sin stock suficiente
        await this.replaceCartProducts(cartId, outOfStock);

        return { status: 'success', ticket, outOfStock };
    }

    /**
     * Procesa la compra del carrito: calcula el total, crea un ticket y vacía el carrito.
     * @param {String} cartId
     * @param {String} purchaserEmail
     */
    async finalizePurchase(cartId, purchaserEmail) {
        if (!this.ticketService) throw new Error('TicketService no inyectado');

        const cart = await this.getCartById(cartId);
        if (!cart) return null;

        // Asegurarse de que los productos estén poblados y calcular total
        const products = cart.products || [];
        if (products.length === 0) {
            return { status: 'error', message: 'Carrito vacío' };
        }

        let total = 0;
        for (const item of products) {
            const prod = item.product;
            const qty = item.quantity || 0;
            if (!prod || typeof prod.price !== 'number') {
                throw new Error('Producto inválido en carrito');
            }
            total += prod.price * qty;
        }

        // Crear ticket usando TicketService
        const ticket = await this.ticketService.createTicket({ amount: total, purchaser: purchaserEmail });

        // Vaciar carrito
        await this.clearCart(cartId);

        return { status: 'success', ticket };
    }
}

module.exports = CartService;