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
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized access",
        code: "UNAUTHORIZED",
      });
    }

    const user = await UserModel.findById(userId).select("isActive role");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.isActive) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message:
          user.role === "candidate"
            ? "Your candidate account has been deactivated. Please contact support."
            : user.role === "recruiter"
            ? "Your recruiter account has been deactivated. Please contact admin."
            : "Your account has been deactivated.",
        code: "ACCOUNT_DEACTIVATED",
      });
    }

    next();
  } catch (err) {
    console.error("checkUserActive error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: getError(err),
      code: "INTERNAL_ERROR",
    });
  }
};
