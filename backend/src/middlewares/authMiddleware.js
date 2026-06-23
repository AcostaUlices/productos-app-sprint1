import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError.js';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No se proporcionó un token de acceso');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // Guardamos los datos del usuario para usarlos después
    next();
  } catch (error) {
    throw new UnauthorizedError('Token inválido o expirado');
  }
}

export default authMiddleware;