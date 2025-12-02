const express = require('express');
const SessionsControllers = require('../controllers/sessions.controllers.js');
const authorize = require('../middlewares/authorization');

const router = express.Router();

function createSessionsRouter(usersService, passport) {
  const sessionsController = new SessionsControllers(usersService);

  // POST /api/sessions/register
  router.post('/register', sessionsController.register);

  // POST /api/sessions/login
  router.post('/login', sessionsController.login);

  // GET /api/sessions/current (autenticación + retorna DTO)
  router.get(
    '/current',
    (req, res, next) => {
      console.log('Cookies recibidas:', req.cookies);
      next();
    },
    (req, res, next) => {
      passport.authenticate('current', { session: false }, (err, user, info) => {
        console.log('Resultado authenticate - err:', err, 'user:', user, 'info:', info);
        
        if (err) {
          console.error('Error en Passport:', err);
          return res.status(500).json({ status: 'error', message: 'Error en autenticación' });
        }

        if (!user) {
          console.log('No se autenticó usuario');
          return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        req.user = user;
        next();
      })(req, res, next);
    },
    sessionsController.current
  );

  // GET /api/sessions/admin (solo admin)
  router.get(
    '/admin',
    (req, res, next) => {
      passport.authenticate('current', { session: false }, (err, user) => {
        if (!user) return res.status(401).json({ status: 'error', message: 'No autenticado' });
        req.user = user;
        next();
      })(req, res, next);
    },
    authorize('admin'),
    (req, res) => {
      res.json({
        status: 'success',
        message: 'Acceso admin concedido',
        user: req.user
      });
    }
  );

  // GET /api/sessions/user (cualquier usuario autenticado)
  router.get(
    '/user',
    (req, res, next) => {
      passport.authenticate('current', { session: false }, (err, user) => {
        if (!user) return res.status(401).json({ status: 'error', message: 'No autenticado' });
        req.user = user;
        next();
      })(req, res, next);
    },
    authorize('user', 'admin'),
    (req, res) => {
      res.json({
        status: 'success',
        message: 'Acceso usuario concedido',
        user: req.user
      });
    }
  );

  // POST /api/sessions/forgot-password
  router.post('/forgot-password', sessionsController.forgotPassword);

  // POST /api/sessions/reset-password
  router.post('/reset-password', sessionsController.resetPassword);

  return router;
}

module.exports = createSessionsRouter;
