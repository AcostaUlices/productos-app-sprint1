import AppError from './AppError.js';

class UnauthorizedError extends AppError {
  constructor(mensaje = 'No autorizado') {
    super(mensaje, 401);
  }
}

export default UnauthorizedError;