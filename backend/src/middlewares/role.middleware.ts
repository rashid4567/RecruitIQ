import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};
