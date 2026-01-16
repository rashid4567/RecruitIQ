import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";

export class RecruiterController {
  constructor(
    private readonly getProfileUC: any,
    private readonly updateProfileUC: any,
    private readonly completeProfileUC: any,
    private readonly updatePasswordUC: any
  ) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.getProfileUC.execute(req.user?.userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Profile loaded successfully",
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.updateProfileUC.execute(
        req.user?.userId,
        req.body
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };

  completeProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const profile = await this.completeProfileUC.execute(
        req.user?.userId,
        req.body
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Recruiter profile completed successfully",
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await this.updatePasswordUC.execute(
        req.user?.userId,
        currentPassword,
        newPassword
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Recruiter password updated successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
