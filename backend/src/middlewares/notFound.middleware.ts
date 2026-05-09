import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../constants/httpStatus";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next();
    return;
  }

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
    code: "ROUTE_NOT_FOUND",
  });
}; 