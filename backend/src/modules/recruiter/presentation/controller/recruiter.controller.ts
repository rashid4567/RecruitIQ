import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { RequestCandidateEmailUpdateUseCase } from "../../../candidate/application/use-cases/request-candidate-emailUpdate.usecase";

export class RecruiterController {
  constructor(
    private readonly getProfileUC: any,
    private readonly updateProfileUC: any,
    private readonly completeProfileUC: any,
    private readonly updatePasswordUC: any,
    private readonly requestemailUpdataUC: {
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
        req.user?.userId,
        req.body,
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
        newPassword,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Recruiter password updated successfully",
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
      const { newEmail } = req.body;
      console.log("REQ BODY:", req.body, typeof req.body);

      if (!newEmail) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "new Email is required",
        });
      }

      await this.requestemailUpdataUC.execute(req.user!.userId, newEmail);

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

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Email updated succesfully",
      });
    } catch (err) {
      return next(err);
    }
  };
}
