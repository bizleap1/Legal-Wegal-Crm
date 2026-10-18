export class AppError extends Error {
  statusCode;
  details;
  constructor(message, statusCode = 500, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 422, details);
    this.name = 'ValidationError';
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: insufficient permissions') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
export class ConflictError extends AppError {
  constructor(message = 'Resource conflict or duplicate detected') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}