const { isValidPassword, generateToken } = require('../utils/auth');
const UserDTO = require('../services/dto/user.dto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const mailingService = require('../services/mailing.service');

// Reglas:
// - POST /forgot-password { email }
//    genera un token JWT corto y envía por email un enlace con el token
// - POST /reset-password { token, newPassword }
//    verifica token, valida que newPassword != password actual, y actualiza contraseña

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

      // Usar UserDTO para no exponer datos sensibles
      const safeUser = UserDTO.from(user);

      res.json({
        status: 'success',
        user: safeUser
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ status: 'error', message: 'Email requerido' });

      const user = await this.usersService.getUserByEmail(email);
      if (!user) return res.status(200).json({ status: 'success', message: 'Si el email existe, se ha enviado un enlace.' });

      // Generar token con expiración corta (1 hora)
      const payload = { id: user._id, action: 'reset' };
      const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });

      // Construir link de reset (adaptar host según despliegue)
      const resetLink = `${req.protocol}://${req.get('host')}/api/sessions/reset-password?token=${token}`;

      // Enviar email
      await mailingService.sendResetPasswordEmail(email, resetLink);

      return res.json({ status: 'success', message: 'Si el email existe, se ha enviado un enlace.' });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) return res.status(400).json({ status: 'error', message: 'Token y nueva contraseña requeridos' });

      // Verificar token
      let payload;
      try {
        payload = jwt.verify(token, config.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({ status: 'error', message: 'Token inválido o expirado' });
      }

      if (payload.action !== 'reset') return res.status(400).json({ status: 'error', message: 'Token no válido para reset' });

      const user = await this.usersService.getUserById(payload.id);
      if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      // Validar que la nueva contraseña (en texto) no sea igual a la actual
      // isValidPassword compara texto con hash
      if (isValidPassword(newPassword, user.password)) {
        return res.status(400).json({ status: 'error', message: 'La nueva contraseña no puede ser igual a la anterior' });
      }

      // Actualizar contraseña (UserDao.updateUser hashéa la contraseña)
      await this.usersService.updateUser(user._id, { password: newPassword });

      return res.json({ status: 'success', message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  };
}

module.exports = SessionsControllers;
