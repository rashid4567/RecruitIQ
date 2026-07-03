import { Request, Response, NextFunction } from "express";
import { ForgotPasswordSchema } from "../validators/forgot-password.schema";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResetPasswordDTO, ResetPasswordSchema } from "../validators/reset-password.schema";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { ForgotPasswordRequestDTO } from "../../application/dto/forgot-password.dto";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class ForgotPasswordController {
  constructor(
    private readonly _forgotPasswordUC:  IUseCase<ForgotPasswordRequestDTO,void>,
    private readonly _resetPasswordUC: IUseCase<ResetPasswordDTO, void>,
  ) {}

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      await this._forgotPasswordUC.execute({email});
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
      )
    } catch (err) {
   
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = ResetPasswordSchema.parse(req.body);
      await this._resetPasswordUC.execute({token, newPassword});
        ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
      )
    } catch (err) {
      next(err);
    }
  };
}
