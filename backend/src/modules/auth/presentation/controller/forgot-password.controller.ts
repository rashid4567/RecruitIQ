import { Request, Response, NextFunction } from "express";
import { ForgotPasswordUseCase } from "../../application/useCase/password/forgot-password.usecase";
import { ResetPasswordUseCase } from "../../application/useCase/password/reset-password.usecase"; 
import { ForgotPasswordSchema } from "../validators/forgot-password.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ResetPasswordSchema } from "../validators/reset-password.schema";

export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordUC: ForgotPasswordUseCase,
    private readonly resetPasswordUC: ResetPasswordUseCase,
  ) {}

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      await this.forgotPasswordUC.execute(email);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (err) {
      console.log("error",err)
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = ResetPasswordSchema.parse(req.body);
      await this.resetPasswordUC.execute(token, newPassword);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (err) {
      console.log("error",err)
      next(err);
    }
  };
}
