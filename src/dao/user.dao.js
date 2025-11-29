const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');

class UserDao {
  constructor() {
    this.model = UserModel;
  }

  async getUserByEmail(email) {
    try {
      return await this.model.findOne({ email }).lean();
    } catch (err) {
      throw new Error(`Error buscando usuario por email: ${err.message}`);
    }
  }

  async getUserById(id) {
    try {
      return await this.model.findById(id).lean();
    } catch (err) {
      throw new Error(`Error buscando usuario por id: ${err.message}`);
    }
  }

  async getAll(filter = {}, projection = null, options = {}) {
    try {
      return await this.model.find(filter, projection, options).lean();
    } catch (err) {
      throw new Error(`Error obteniendo usuarios: ${err.message}`);
    }
  }

  async createUser(userData) {
    try {
      // Hashear la contraseña antes de guardar (si viene)
      const data = { ...userData };
      if (data.password) {
        const saltRounds = 10;
        data.password = bcrypt.hashSync(data.password, saltRounds);
      }

      const user = new this.model(data);
      const saved = await user.save();
      return saved.toObject();
    } catch (err) {
      throw new Error(`Error creando usuario: ${err.message}`);
    }
  }

  async updateUser(id, updateData) {
    try {
      const data = { ...updateData };
      if (data.password) {
        const saltRounds = 10;
        data.password = bcrypt.hashSync(data.password, saltRounds);
      }

      const updated = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
      return updated;
    } catch (err) {
      throw new Error(`Error actualizando usuario: ${err.message}`);
    }
  }

  async deleteUser(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (err) {
      throw new Error(`Error eliminando usuario: ${err.message}`);
    }
  }
}

module.exports = UserDao;
