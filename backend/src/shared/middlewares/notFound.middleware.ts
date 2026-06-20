import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";


export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    return next();
  }

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    type: "NOT_FOUND",
    code: "ROUTE_NOT_FOUND",
    message: `API route not found: ${req.originalUrl}`,
  });
};
