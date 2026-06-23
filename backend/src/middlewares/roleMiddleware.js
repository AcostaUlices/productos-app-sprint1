import UnauthorizedError from '../errors/UnauthorizedError.js';

function roleMiddleware(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      const error = new UnauthorizedError('No tenés permisos para realizar esta acción');
      error.statusCode = 403; // Forbidden: identificado, pero sin permiso
      throw error;
    }
    next();
  };
}

export default roleMiddleware;