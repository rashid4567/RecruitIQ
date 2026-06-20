import { Request, Response, NextFunction } from "express";
import { RenewSubscriptionUseCase } from "../../../application/usecase/Recruiter/RenewSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class RenewSubscriptionController {
  constructor(private readonly renewUC: RenewSubscriptionUseCase) {}

  renew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const result = await this.renewUC.execute(recruiterId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_RENEWED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
