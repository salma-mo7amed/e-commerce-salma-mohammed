// creating app error class from the error to use in handling any error that could show in any api:
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
