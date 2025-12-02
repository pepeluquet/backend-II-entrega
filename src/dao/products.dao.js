const crypto = require("crypto")
const ProductModel = require('../models/product.model');

class ProductsDAO {
  async getAll(filter = {}, options = {}) {
    // si usas mongoose-paginate-v2
    if (typeof ProductModel.paginate === 'function') {
      return await ProductModel.paginate(filter, options);
    }
    // fallback: devolver array simple con paginación manual básica
    const limit = options.limit ? parseInt(options.limit) : 10;
    const page = options.page ? parseInt(options.page) : 1;
    const docs = await ProductModel.find(filter)
      .sort(options.sort || {})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await ProductModel.countDocuments(filter);
    return {
      docs,
      totalDocs: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  // alias usado por otros módulos
  async getProductById(id) {
    return this.getById(id);
  }

  async create(productData) {
    return await ProductModel.create(productData);
  }

  async update(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  async paginate(filter, options) {
    if (typeof ProductModel.paginate === 'function') {
      return await ProductModel.paginate(filter, options);
    }
    return this.getAll(filter, options);
  }

  async updateStock(productId, quantityChange) {
    return await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantityChange } },
      { new: true }
    );
  }

  async getAllProducts() {
    // compatibilidad con llamadas que esperan lista completa
    return await ProductModel.find().lean();
  }
}

module.exports = ProductsDAO;
