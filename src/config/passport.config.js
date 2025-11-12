const JwtStrategy = require('passport-jwt').Strategy;
const { cookieExtractor } = require('../utils/auth');

// Utilice la clave SECRET_KEY del entorno si está disponible; de ​​lo contrario, utilice una predeterminada.
const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: SECRET_KEY
};

module.exports = function(passport) {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (err) {
      return done(err, false);
    }
  }));
};
