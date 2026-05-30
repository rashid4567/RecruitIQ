import { Request, Response, NextFunction } from "express";
import { RenewSubscriptionUseCase } from "../../../application/usecase/Recruiter/RenewSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class RenewSubscriptionController {
  constructor(private readonly renewUC: RenewSubscriptionUseCase) {}

  renew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const result = await this.renewUC.execute(recruiterId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription renewed",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
