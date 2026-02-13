import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApplicationError } from "./applicatoin.error"

const ERROR_STATUS_MAP: Record<string, number> = {
  USER_ALREADY_EXISTS: 409,
  PASSWORD_RESET_NOT_ALLOWED: 403,
  INVALID_OTP: 400,

  ROLE_REQUIRED: 400,
  GOOGLE_LOGIN_NOT_ALLOWED_FOR_ADMIN: 403,
  EMAIL_ALREADY_EXISTS: 409,
  ROLE_MISMATCH: 409,
  ACCOUNT_DEACTIVATED: 403,
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
 
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      type: "VALIDATION_ERROR",
      errors: err.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }


  if (err instanceof ApplicationError) {
    return res.status(ERROR_STATUS_MAP[err.code] ?? 400).json({
      success: false,
      type: "APPLICATION_ERROR",
      code: err.code,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    type: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
}
