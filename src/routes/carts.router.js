const express = require('express');
const CartDao = require('../dao/cart.dao.js');
const CartService = require('../services/cart.services.js');
const CartController = require('../controllers/cart.controllers.js');
const passport = require('passport');
const authorization = require('../middlewares/authorization');
const TicketService = require('../services/ticket.services.js');

const router = express.Router();
const cartDao = new CartDao();
const ticketService = new TicketService();
const cartService = new CartService(cartDao, ticketService);
const cartController = new CartController(cartService);

// POST /api/carts
router.post('/', cartController.createCart);

// GET /api/carts/:cid
router.get('/:cid', cartController.getCartProducts);

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), authorization('user'), cartController.addProductToCart);

// POST /api/carts/:cid/purchase - finalizar compra (solo usuarios autenticados)
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), authorization('user'), cartController.finalizePurchase);

module.exports = router;