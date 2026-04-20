/**
 * Custom error classes for service layer
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code || "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, code?: string) {
    super(`${resource} not found`, 404, code || "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code?: string) {
    super(message, 401, code || "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code?: string) {
    super(message, 403, code || "FORBIDDEN");
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 409, code || "CONFLICT");
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error", code?: string) {
    super(message, 500, code || "INTERNAL_SERVER_ERROR");
  }
}
