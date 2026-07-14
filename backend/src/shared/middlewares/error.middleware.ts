import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../../modules/Activity.logger/infrastructure/logging/logger";
import { ApplicationError } from "../errors/application.error";
import { DomainError } from "../errors/domain.error";



const ERROR_STATUS_MAP: Record<string, number> = {
  USER_ALREADY_EXISTS: 409,
  PASSWORD_RESET_NOT_ALLOWED: 403,
  INVALID_OTP: 400,
  ROLE_REQUIRED: 400,
  GOOGLE_LOGIN_NOT_ALLOWED_FOR_ADMIN: 403,
  EMAIL_ALREADY_EXISTS: 409,
  ROLE_MISMATCH: 409,
  ACCOUNT_DEACTIVATED: 403,
  INVALID_CURRENT_PASSWORD: 400,
  PASSWORD_CHANGE_NOT_ALLOWED: 403,
  PASSWORD_NOT_SET: 400,
  USER_NOT_FOUND: 404,
};

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error({
    message: "Request Error",
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    error:
      err instanceof Error
        ? {
            name: err.name,
            message: err.message,
            stack: err.stack,
          }
        : err,
  });

  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      type: "VALIDATION_ERROR",
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }


  if (err instanceof ApplicationError) {
    const statusCode = ERROR_STATUS_MAP[err.code] ?? 400;
    res.status(statusCode).json({
      success: false,
      type: "APPLICATION_ERROR",
      code: err.code,
      message: err.message,
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(400).json({
      success: false,
      type: "DOMAIN_ERROR",
      message: err.message,
    });
    return;
  }
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    res.status(409).json({
      success: false,
      type: "DATABASE_ERROR",
      message: "Duplicate field value entered",
    });
    return;
  }
  const message = err instanceof Error ? err.message : "Something went wrong";
  res.status(500).json({
    success: false,
    type: "INTERNAL_SERVER_ERROR",
    message,
  });
}
