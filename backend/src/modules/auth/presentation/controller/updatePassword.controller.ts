import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { UpdatePasswordSchema } from "../validators/updatepassword.validator";
import { userIdSchema } from "../validators/userId.validator";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { RequestUpdatePassword } from "../../application/dto/UpdatePasswordDTO";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class ChangePasswordController {
  constructor(
    private readonly _updatePasswordUC: IUseCase<RequestUpdatePassword, void>,
  ) {}

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const body = UpdatePasswordSchema.parse(req.body);
      await this._updatePasswordUC.execute({
        userId,
        current: body.currentPassword,
        next: body.newPassword,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PASSWORD_UPDATED_SUCCESSFULLY,
      )
    } catch (err) {
      console.error("password updated failed :", err);
      next(err);
    }
  };
}
