import { Request, Response, NextFunction } from "express";
import { UpdatePasswordUseCase } from "../../application/useCase/password/update-password.usecase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { UpdatePasswordSchema } from "../validators/updatepassword.validator";
import { userIdSchema } from "../validators/userId.validator";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { RequestUpdatePassword } from "../../application/dto/UpdatePasswordDTO";

export class ChangePasswordController {
  constructor(
    private readonly updatePasswordUC: UseCase<RequestUpdatePassword, void>,
  ) {}

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const body = UpdatePasswordSchema.parse(req.body);
      console.log("raw body :", req.body);
      console.log("after parse :", body);
      await this.updatePasswordUC.execute({
        userId,
        current: body.currentPassword,
        next: body.newPassword,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PASSWORD_UPDATED_SUCCESSFULLY,
      });
    } catch (err) {
      console.error("password updated failed :", err);
      next(err);
    }
  };
}
