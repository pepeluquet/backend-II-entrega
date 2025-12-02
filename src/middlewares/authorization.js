// Middleware de autorización basado en roles
// Uso: app.use('/ruta', authorization('admin'), controlador)

module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      console.log('No hay usuario autenticado');
      return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log(`Usuario con rol "${req.user.role}" intenta acceder a ruta que requiere: ${allowedRoles.join(', ')}`);
      return res.status(403).json({ status: 'error', message: 'Acceso denegado: rol insuficiente' });
    }

    console.log(`Usuario autorizado con rol "${req.user.role}"`);
    next();
  };
};
