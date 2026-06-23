import AppError from './AppError.js';

class ConflictError extends AppError {
  constructor(mensaje = 'El recurso ya existe') {
    super(mensaje, 409);
  }
}

export default ConflictError;