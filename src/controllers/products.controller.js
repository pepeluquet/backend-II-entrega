class ProductsController {
  constructor(productsService) {
    this.productsService = productsService;
  }

  getAllProducts = async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const filter = {};

      // Filtro por categoría o status
      if (query) {
        if (query === 'true' || query === 'false') {
          filter.status = query === 'true';
        } else {
          filter.category = query;
        }
      }

      // Opciones de paginación y ordenamiento
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true
      };
      if (sort) {
        options.sort = { price: sort === 'asc' ? 1 : -1 };
      }

      const result = await this.productsService.getAllProducts(filter, options);

      // Construcción de links
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
      const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null;
      const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null;

      res.json({
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink
      });
    } catch (error) {
      console.error('Error al obtener productos:', error.message);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await this.productsService.getProductById(pid);

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Producto no encontrado'
        });
      }

      res.json({
        status: 'success',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
}

module.exports = ProductsController;

