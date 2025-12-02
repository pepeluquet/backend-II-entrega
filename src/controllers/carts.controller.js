class CartsController {
  constructor(cartsService) {
    this.cartsService = cartsService;
  }

  checkout = async (req, res) => {
    try {
      const { cartId } = req.params;
      const userEmail = req.user.email; // del JWT

      if (!userEmail) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Usuario no autenticado' 
        });
      }

      const result = await this.cartsService.checkout(cartId, userEmail);

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error en checkout:', error.message);
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  };

  getCart = async (req, res) => {
    try {
      const { cartId } = req.params;
      const cart = await this.cartsService.getCartById(cartId);

      res.json({
        status: 'success',
        data: cart
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  };

  addProduct = async (req, res) => {
    try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body;

      const result = await this.cartsService.addProductToCart(cartId, productId, quantity);

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  };
}

module.exports = CartsController;