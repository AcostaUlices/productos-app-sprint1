class AppError extends Error {
  constructor(mensaje, statusCode) {
    super(mensaje);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export default AppError;