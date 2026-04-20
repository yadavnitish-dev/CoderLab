/**
 * Custom error classes for service layer
 */
export class AppError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message, code) {
        super(message, 400, code || "VALIDATION_ERROR");
    }
}
export class NotFoundError extends AppError {
    constructor(resource, code) {
        super(`${resource} not found`, 404, code || "NOT_FOUND");
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", code) {
        super(message, 401, code || "UNAUTHORIZED");
    }
}
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", code) {
        super(message, 403, code || "FORBIDDEN");
    }
}
export class ConflictError extends AppError {
    constructor(message, code) {
        super(message, 409, code || "CONFLICT");
    }
}
export class InternalServerError extends AppError {
    constructor(message = "Internal server error", code) {
        super(message, 500, code || "INTERNAL_SERVER_ERROR");
    }
}
