import { Request, Response, NextFunction } from "express";
import { RequestEmailUpdateUseCase } from "../../application/useCase/request-email.update.usecase";
import { VerifyEmailUpdateUseCase } from "../../application/useCase/verify-email-update.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import {
  RequestEmailUpdateSchema,
  VerifyEmailUpdateSchema,
} from "../validators/email-update.validation";

export class EmailUpdateController {
  constructor(
    private readonly requestEmailUpdateUc: RequestEmailUpdateUseCase,
    private readonly verifyEmailUc: VerifyEmailUpdateUseCase,
  ) {}

  requestEmailUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not found",
        });
      }

      const { newEmail } = RequestEmailUpdateSchema.parse(req.body);

      await this.requestEmailUpdateUc.execute(userId, newEmail);

      return res.status(HTTP_STATUS.OK).json({
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
      const userId = req.user?.userId;
      const role = req.user?.role;

      if (!userId || !role) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const body = VerifyEmailUpdateSchema.parse({
        ...req.body,
        role,
      });

      await this.verifyEmailUc.execute({
        userId,
        newEmail: body.newEmail,
        otp: body.otp,
        context: body.role,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Email updated successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
