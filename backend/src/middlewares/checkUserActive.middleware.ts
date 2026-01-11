import { Request, Response, NextFunction } from "express";
import { UserModel } from "../user/user.model";
import { HTTP_STATUS } from "../constants/httpStatus";
import { getError } from "../utils/getErrorMessage";

export const checkUserActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized Access",
        code: "UNAUTHORIZED"
      });
    }

    const user = await UserModel.findById(req.user?.userId).select("isActive role");

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND"
      });
    }

    if (!user.isActive) {
      const message = 
        user.role === "candidate" 
          ? "Your candidate account has been deactivated. Please contact support for assistance."
          : user.role === "recruiter"
          ? "Your recruiter account has been deactivated. Please contact admin for assistance."
          : "Your account has been deactivated. Please contact support.";

      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: message,
        code: "ACCOUNT_DEACTIVATED"
      });
    }

    next();
  } catch (err) {
    console.error("User Active middleware error", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: getError(err),
      code: "INTERNAL_ERROR"
    });
  }
};