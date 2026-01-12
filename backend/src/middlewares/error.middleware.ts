import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";

interface AppErrorShape {
  statusCode?: number;
  status?: number;
  message?: string;
  code?: string;
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";

  if (typeof err === "object" && err !== null) {
    const error = err as AppErrorShape;

    statusCode = error.statusCode ?? error.status ?? statusCode;
    message = error.message ?? message;
    code = error.code ?? code;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("🔥 Global Error:", err);
  } else {
    console.error(`🔥 Error: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
  });
};
