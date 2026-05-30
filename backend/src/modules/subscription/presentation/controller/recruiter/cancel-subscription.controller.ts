import { Request, Response, NextFunction } from "express";
import { CancelSubscriptionUseCase } from "../../../application/usecase/Recruiter/CancelSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class CancelSubscriptionController {
  constructor(private readonly cancelUC: CancelSubscriptionUseCase) {}

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }
      await this.cancelUC.execute(recruiterId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription cancelled",
      });
    } catch (err) {
      next(err);
    }
  };
}
