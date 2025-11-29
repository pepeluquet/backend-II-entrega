const JwtStrategy = require('passport-jwt').Strategy;

// Extrae el token JWT desde la cookie 'currentUser'
function cookieExtractor(req) {
  if (!req || !req.headers) return null;

  // Si estamos usando cookie-parser, req.cookies estará disponible
  if (req.cookies && req.cookies.currentUser) {
    return req.cookies.currentUser;
  }

  // Fallback: parsear la cabecera Cookie manualmente
  const cookieHeader = req.headers.cookie || req.headers.Cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith('currentUser=')) {
      return decodeURIComponent(c.split('=')[1]);
    }
  }

  return null;
}

// Usa JWT_SECRET si está definido, sino SECRET_KEY como fallback
const SECRET_KEY = process.env.JWT_SECRET || process.env.SECRET_KEY || 'reemplazar_por_un_secreto_seguro';

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: SECRET_KEY
};

// Nota: la opción `session: false` se pasa cuando uses el middleware
// `passport.authenticate('jwt', { session: false })` en las rutas.
module.exports = function(passport) {
  // Registramos la estrategia con nombre 'current' para poder referirnos a ella
  passport.use('current', new JwtStrategy(opts, (jwt_payload, done) => {
    try {
      // jwt_payload contiene la información que haya sido firmada en el token
      return done(null, jwt_payload);
    } catch (err) {
      return done(err, false);
    }
  }));
};
