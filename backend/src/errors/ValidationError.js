import AppError from './AppError.js';

class ValidationError extends AppError {
  constructor(mensaje) {
    super(mensaje, 400); // 400 = Bad Request
  }
}

export default ValidationError;