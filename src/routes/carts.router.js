const express = require('express');
const CartController = require('../controllers/cart.controllers');

const router = express.Router();

function createCartsRouter(cartService, passport) {
  const cartController = new CartController(cartService);

  // Middleware de autenticación (opcional)
  const authenticateUser = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user) => {
      if (user) req.user = user;
      next(); // permitir continuar aunque no esté autenticado
    })(req, res, next);
  };

  // POST /api/carts - Crear carrito
  router.post('/', cartController.createCart);

  // GET /api/carts/:cid/products - Ver productos del carrito
  router.get('/:cid/products', cartController.getCartProducts);

  // POST /api/carts/:cid/products/:pid - Agregar producto
  router.post('/:cid/products/:pid', cartController.addProductToCart);

  // DELETE /api/carts/:cid/products/:pid - Eliminar producto
  router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);

  // PUT /api/carts/:cid - Reemplazar todos los productos
  router.put('/:cid', cartController.replaceCartProducts);

  // PUT /api/carts/:cid/products/:pid - Actualizar cantidad
  router.put('/:cid/products/:pid', cartController.updateProductQuantity);

  // DELETE /api/carts/:cid - Vaciar carrito
  router.delete('/:cid', cartController.clearCart);

  // POST /api/carts/:cid/purchase - Finalizar compra ⭐
  router.post('/:cid/purchase', authenticateUser, cartController.finalizePurchase);

  return router;
}

module.exports = createCartsRouter;