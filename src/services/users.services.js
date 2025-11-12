class UsersService {
  constructor(usersDao) {
    this.usersDao = usersDao;
  }

  async getUserByEmail(email) {
    return await this.usersDao.getUserByEmail(email);
  }

  async getUserById(id) {
    return await this.usersDao.getUserById(id);
  }

  async createUser(userData) {
    return await this.usersDao.createUser(userData);
  }

  async updateUser(id, updateData) {
    return await this.usersDao.updateUser(id, updateData);
  }

  async deleteUser(id) {
    return await this.usersDao.deleteUser(id);
  }
}

module.exports = UsersService;
