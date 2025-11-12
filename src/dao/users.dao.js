const UserModel = require('../models/user.model');

class UsersDao {
  async getUserByEmail(email) {
    try {
      return await UserModel.findOne({ email }).lean();
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      return await UserModel.findById(id).lean();
    } catch (error) {
      throw new Error(`Error finding user by id: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async updateUser(id, updateData) {
    try {
      return await UserModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      return await UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = UsersDao;
