const UserDTO = require('../services/dto/user.dto');

class UserRepository {
  constructor(userDao) {
    this.userDao = userDao;
  }

  // Registra un nuevo usuario usando el DAO. Devuelve el UserDTO del usuario creado.
  async registerUser(userData) {
    try {
      const created = await this.userDao.createUser(userData);
      return UserDTO.from(created);
    } catch (err) {
      throw new Error(`Error en registerUser: ${err.message}`);
    }
  }

  // Obtiene un usuario por email y devuelve su DTO (sin campos sensibles)
  async getUserByEmail(email) {
    try {
      const user = await this.userDao.getUserByEmail(email);
      if (!user) return null;
      return UserDTO.from(user);
    } catch (err) {
      throw new Error(`Error en getUserByEmail: ${err.message}`);
    }
  }
}

module.exports = UserRepository;
