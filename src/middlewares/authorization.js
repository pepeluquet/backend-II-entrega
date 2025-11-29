// Middleware de autorización basado en roles
// Uso: app.use('/ruta', authorization('admin'), controlador)

function authorization(requiredRole) {
  return (req, res, next) => {
    // Si no hay usuario autenticado
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado'
      });
    }

    // Si no se especifica rol requerido, permitir el acceso
    if (!requiredRole) return next();

    // Comparar roles (exact match)
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: rol insuficiente'
      });
    }

    // Rol válido
    next();
  };
}

module.exports = authorization;
