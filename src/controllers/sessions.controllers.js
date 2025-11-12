const { isValidPassword, generateToken } = require('../utils/auth');

class SessionsControllers {
  constructor(usersService) {
    this.usersService = usersService;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Verifica que su correo electrónico y contraseña estén presentes.
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario por correo electrónico
      const user = await this.usersService.getUserByEmail(email);

      // Verificar que el usuario exista
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Verificar contraseña
      if (!isValidPassword(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Generar token JWT
      const token = generateToken(user);

      // Establecer cookie httpOnly con JWT
      res.cookie('currentUser', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Retornar respuesta de éxito
      res.json({
        status: 'success',
        message: 'Sesión iniciada correctamente',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  current = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'No autenticado'
        });
      }

      const user = await this.usersService.getUserById(req.user.id);

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        status: 'success',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          role: user.role,
          cart: user.cart
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
}

module.exports = SessionsControllers;
