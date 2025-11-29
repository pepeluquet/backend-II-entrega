class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.status(201).json(newCart);
        } catch {
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    };

    getCartProducts = async (req, res) => {
        const { cid } = req.params;
        try {
            // Usar populate para traer detalles completos del producto
            const cart = await this.cartService.getCartById(cid);
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
            res.json(cart.products); // Devuelve los productos con detalles
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const updatedCart = await this.cartService.addProductToCart(cid, pid);
            if (!updatedCart) {
                return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
            }
            res.json({ status: 'success', cart: updatedCart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    };

    // 1. Eliminar un producto específico del carrito
    deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const cart = await this.cartService.removeProductFromCart(cid, pid);
            if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // 2. Reemplazar todos los productos del carrito
    replaceCartProducts = async (req, res) => {
        const { cid } = req.params;
        const { products } = req.body; // Debe ser un array [{product, quantity}]
        try {
            const cart = await this.cartService.replaceCartProducts(cid, products);
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // 3. Actualizar SOLO la cantidad de un producto
    updateProductQuantity = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cart = await this.cartService.updateProductQuantity(cid, pid, quantity);
            if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // 4. Vaciar completamente el carrito
    clearCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cart = await this.cartService.clearCart(cid);
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // 5. Finalizar compra del carrito
    finalizePurchase = async (req, res) => {
        const { cid } = req.params;
        // Preferir email del usuario autenticado si está disponible
        const purchaser = (req.user && req.user.email) || req.body.purchaser;
        if (!purchaser) return res.status(400).json({ status: 'error', message: 'Purchaser (email) requerido' });

        try {
            const result = await this.cartService.finalizePurchase(cid, purchaser);
            if (!result) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
            if (result.status && result.status === 'error') {
                return res.status(400).json(result);
            }

            // Devolver el ticket creado
            return res.json({ status: 'success', ticket: result.ticket });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    };
}

module.exports = CartController;