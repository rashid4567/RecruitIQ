import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import {
  RequestEmailUpdateSchema,
  VerifyEmailUpdateSchema,
} from "../validators/email-update.validation";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { RequestEmailUpdateDTO } from "../../application/dto/EmailUpdateDTO";
import { VerifyEmailUpdateDTO } from "../../application/dto/verify-email-update.dto";

export class EmailUpdateController {
  constructor(
    private readonly requestEmailUpdateUc: IUseCase<RequestEmailUpdateDTO, void>,
    private readonly verifyEmailUc: IUseCase<VerifyEmailUpdateDTO, void>,
  ) {}

  requestEmailUpdate = async (
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
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      if (role !== "candidate" && role !== "recruiter") {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: SUCCESS_MESSAGES.EMAIL_UPDATE_NOT_ALLOWED_FOR_THIS_ROLE,
        });
      }

      const { newEmail } = RequestEmailUpdateSchema.parse(req.body);

      await this.requestEmailUpdateUc.execute({userId, newEmail, role});

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "OTP sent to new email",
      });
    } catch (err) {
      console.log("error", err);
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
      console.log("error", err);
      next(err);
    }
  };
}
