import { Request, Response, NextFunction } from "express";
import { GetCurrentSubscriptionUseCase } from "../../../application/usecase/Recruiter/GetCurrentSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetCurrentSubsriptionController {
  constructor(
    private readonly getCurrentSubscriptionUC: GetCurrentSubscriptionUseCase,
  ) {}

  getCurrentSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const subscription =
        await this.getCurrentSubscriptionUC.execute(recruiterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Current subscription fetched successfully",
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };
}
