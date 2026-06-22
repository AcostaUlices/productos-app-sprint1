import AppError from './AppError.js';

class NotFoundError extends AppError {
  constructor(mensaje = 'Recurso no encontrado') {
    super(mensaje, 404); // 404 = Not Found
  }
}

export default NotFoundError;