const express = require('express');
const SessionsControllers = require('../controllers/sessions.controllers.js');

const router = express.Router();

function createSessionsRouter(usersService, passport) {
  const sessionsController = new SessionsControllers(usersService);

  // POST /api/sessions/login
  router.post('/login', sessionsController.login);

  // GET /api/sessions/current
  router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    sessionsController.current
  );

  return router;
}

module.exports = createSessionsRouter;
