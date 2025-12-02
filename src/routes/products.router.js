const express = require('express');
const ProductsController = require('../controllers/products.controller');
const passport = require('passport');
const authorization = require('../middlewares/authorization');
const uploader = require('../utils/uploaders');
const ProductDao = require('../dao/products.dao.js');
const ProductsService = require('../services/products.services.js');


const router = express.Router();
const productDao = new ProductDao();
const productsService = new ProductsService(productDao);
const productsController = new ProductsController(productsService);

function createProductsRouter(productsService) {
  const productsController = new ProductsController(productsService);

  // GET /api/products - Ver todos los productos
  router.get('/', productsController.getAllProducts);

  // GET /api/products/:pid - Ver un producto específico
  router.get('/:pid', productsController.getProductById);

  // POST /api/products - Crear producto (admin)
  // router.post(
  //   '/',
  //   passport.authenticate('jwt', { session: false }),
  //   authorization('admin'),
  //   uploader.array('thumbnails'),
  //   productsController.createProduct
  // );

  // PUT /api/products/:pid - Actualizar producto (admin)
  // router.put(
  //   '/:pid',
  //   passport.authenticate('jwt', { session: false }),
  //   authorization('admin'),
  //   productsController.updateProduct
  // );

  // DELETE /api/products/:pid - Eliminar producto (admin)
  // router.delete(
  //   '/:pid',
  //   passport.authenticate('jwt', { session: false }),
  //   authorization('admin'),
  //   productsController.deleteProduct
  // );

  return router;
}

module.exports = createProductsRouter;