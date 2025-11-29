class UserDTO {
  constructor(user = {}) {
    // Acepta campos en camelCase o snake_case y provee valores por defecto
    this.first_name = user.firstName || user.first_name || '';
    this.last_name = user.lastName || user.last_name || '';
    this.email = user.email || '';
    this.age = typeof user.age !== 'undefined' ? user.age : null;
    this.role = user.role || 'user';
  }

  toObject() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      age: this.age,
      role: this.role
    };
  }

  // Método estático de conveniencia: devuelve el DTO directamente
  static from(user) {
    return new UserDTO(user).toObject();
  }
}

module.exports = UserDTO;
