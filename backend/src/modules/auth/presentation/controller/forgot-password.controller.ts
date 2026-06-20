import { Request, Response, NextFunction } from "express";
import { ForgotPasswordSchema } from "../validators/forgot-password.schema";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ResetPasswordDTO, ResetPasswordSchema } from "../validators/reset-password.schema";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { ForgotPasswordRequestDTO } from "../../application/dto/forgot-password.dto";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";

export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordUC:  UseCase<ForgotPasswordRequestDTO,void>,
    private readonly resetPasswordUC: UseCase<ResetPasswordDTO, void>,
  ) {}

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      await this.forgotPasswordUC.execute({email});

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
      });
    } catch (err) {
      console.log("error",err)
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = ResetPasswordSchema.parse(req.body);
      await this.resetPasswordUC.execute({token, newPassword});

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
      });
    } catch (err) {
      console.log("error",err)
      next(err);
    }
  };
}
