import AppError from '../errors/AppError.js';

function errorHandler(err, req, res, next) {
  // Si es un error nuestro (conocido), usamos su statusCode
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      mensaje: err.message,
    });
  }

  // Si es un error inesperado (no controlado), lo logueamos
  // pero NO exponemos detalles internos al cliente
  console.error('Error inesperado:', err);

  return res.status(500).json({
    error: 'InternalServerError',
    mensaje: 'Ocurrió un error interno en el servidor',
  });
}

export default errorHandler;