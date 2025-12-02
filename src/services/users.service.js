const { createHash } = require('../utils/auth');

class UsersService {
  constructor(usersDAO) {
    this.usersDAO = usersDAO;
  }

  async create(userData) {
    try {
      // Validar que el email no exista
      const existingUser = await this.usersDAO.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Hashear contraseña
      const hashedPassword = createHash(userData.password);

      // Crear usuario
      const newUser = await this.usersDAO.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        age: userData.age,
        password: hashedPassword,
        role: 'user' // rol por defecto
      });

      return newUser;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    return await this.usersDAO.findByEmail(email);
  }

  async getUserById(id) {
    return await this.usersDAO.findById(id);
  }

  async updateUser(id, updateData) {
    return await this.usersDAO.update(id, updateData);
  }
}

module.exports = UsersService;