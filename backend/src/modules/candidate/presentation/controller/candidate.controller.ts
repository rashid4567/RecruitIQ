import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class CandidateController {
  constructor(
    private readonly getProfileUC: {
      execute(userId: string): Promise<any>;
    },
    private readonly updateProfileUC: {
      execute(userId: string, data: any): Promise<any>;
    },
    private readonly completeProfileUC: {
      execute(userId: string, data: any): Promise<any>;
    },
    private readonly updatePasswordUC: {
      execute(
        userId: string,
        currentPassword: string,
        newPassword: string,
      ): Promise<void>;
    },
    private readonly requestEmailUpdateUC: {
      execute(userId: string, newEmail: string): Promise<void>;
    },
    private readonly verifyEmailUpdateUC: {
      execute(input: {
        userId: string;
        newEmail: string;
        otp: string;
      }): Promise<void>;
    },
  ) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.getProfileUC.execute(req.user!.userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Candidate profile loaded",
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.updateProfileUC.execute(
        req.user!.userId,
        req.body,
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

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.completeProfileUC.execute(
        req.user!.userId,
        req.body,
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Profile completed successfully",
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
        req.user!.userId,
        currentPassword,
        newPassword,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      next(err);
    }
  };

  requestEmailUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.requestEmailUpdateUC.execute(
        req.user!.userId,
        req.body.newEmail,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "OTP sent to new email",
      });
    } catch (err) {
      next(err);
    }
  };

  verifyEmailUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.verifyEmailUpdateUC.execute({
        userId: req.user!.userId,
        newEmail: req.body.newEmail,
        otp: req.body.otp,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Email updated successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
