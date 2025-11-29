const express = require('express');
const SessionsControllers = require('../controllers/sessions.controllers.js');

const router = express.Router();

function createSessionsRouter(usersService, passport) {
  const sessionsController = new SessionsControllers(usersService);

  // POST /api/sessions/login
  router.post('/login', sessionsController.login);

  // POST /api/sessions/forgot-password
  router.post('/forgot-password', sessionsController.forgotPassword);

  // POST /api/sessions/reset-password
  router.post('/reset-password', sessionsController.resetPassword);

  // GET /api/sessions/current (usa la estrategia 'current' de Passport)
  router.get(
    '/current',
    passport.authenticate('current', { session: false }),
    sessionsController.current
  );

  return router;
}

module.exports = createSessionsRouter;
