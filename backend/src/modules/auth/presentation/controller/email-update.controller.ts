import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import {
  RequestEmailUpdateSchema,
  VerifyEmailUpdateSchema,
} from "../validators/email-update.validation";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../shared/utils/api-response";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { RequestEmailUpdateDTO } from "../../application/dto/EmailUpdateDTO";
import { VerifyEmailUpdateDTO } from "../../application/dto/verify-email-update.dto";

export class EmailUpdateController {
  constructor(
    private readonly _requestEmailUpdateUc: IUseCase<
      RequestEmailUpdateDTO,
      void
    >,
    private readonly _verifyEmailUc: IUseCase<VerifyEmailUpdateDTO, void>,
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
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      if (role !== "candidate" && role !== "recruiter") {
        return ApiResponse.error(
          res,
          HTTP_STATUS.FORBIDDEN,
          SUCCESS_MESSAGES.EMAIL_UPDATE_NOT_ALLOWED_FOR_THIS_ROLE,
        );
      }

      const { newEmail } = RequestEmailUpdateSchema.parse(req.body);
      await this._requestEmailUpdateUc.execute({
        userId,
        newEmail,
        role,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.OTP_SENT_TO_NEW_EMAIL,
      );
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
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      if (role !== "candidate" && role !== "recruiter") {
        return ApiResponse.error(
          res,
          HTTP_STATUS.FORBIDDEN,
          SUCCESS_MESSAGES.EMAIL_UPDATE_NOT_ALLOWED_FOR_THIS_ROLE,
        );
      }

      const { newEmail, otp } = VerifyEmailUpdateSchema.parse(req.body);

      await this._verifyEmailUc.execute({
        userId,
        newEmail,
        otp,
        context: role,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.EMAIL_UPDATED_SUCCESSFULLY,
      );
    } catch (err) {
      next(err);
    }
  };
}
