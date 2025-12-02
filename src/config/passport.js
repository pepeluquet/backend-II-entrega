const { Strategy: JwtStrategy } = require('passport-jwt');
const { cookieExtractor } = require('../utils/auth');
const config = require('./config');

module.exports = function initPassport(passport, usersService) {
  const SECRET_KEY = config.JWT_SECRET;
  
  console.log('Inicializando Passport con SECRET_KEY:', SECRET_KEY); // <-- debug

  const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: SECRET_KEY
  };

  passport.use(
    'current',
    new JwtStrategy(opts, async (payload, done) => {
      try {
        console.log('Payload JWT recibido:', payload);
        console.log('Buscando usuario con ID:', payload.id);

        const user = await usersService.getUserById(payload.id);
        
        if (!user) {
          console.log('Usuario no encontrado en BD');
          return done(null, false);
        }

        console.log('Usuario encontrado:', user.email);
        return done(null, { id: user._id, email: user.email, role: user.role, cart: user.cart });
      } catch (err) {
        console.error('Error en estrategia JWT:', err.message);
        return done(err, false);
      }
    })
  );
};