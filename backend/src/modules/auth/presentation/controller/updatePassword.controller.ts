import { Request, Response, NextFunction } from "express";
import { UpdatePasswordUseCase } from "../../application/useCase/update-password.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { UpdatePasswordSchema } from "../validators/updatepassword.validator";
import { userIdSchema } from "../validators/userId.validator";
//import { logger } from "../../../../shared/logger/logger";

export class ChangePasswordController {
  constructor(private readonly updatePasswordUC: UpdatePasswordUseCase) {}

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const body = UpdatePasswordSchema.parse(req.body);

      // logger.info(
      //   { requestId: req.requestId, userId },
      //   "change password request received",
      // );

      await this.updatePasswordUC.execute({
        userId,
        current: body.currentPassword,
        next: body.newPassword,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      // logger.error(
      //   {
      //     requestId: req.requestId,
      //     err,
      //   },
      //   "Change password failed",
      // );

      next(err);
    }
  };
}
