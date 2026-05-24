import { Request, Response, NextFunction } from "express";
import { SubscribeUseCase } from "../../../application/useCase/subscription.plans/Subscribe.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { subscribeSchema } from "../../validator/Subscribe.validator";

export class SubscribeController {
  constructor(private readonly subscribeUC: SubscribeUseCase) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        planId,
        razorpaySubscriptionId,
        razorpayOrderId,
        razorpayCustomerId,
        startDate,
        endDate,
        renewsAt,
        autoRenew,
        status,
      } = subscribeSchema.parse(req.body);

      const recruiterId = req.params.recruiterId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Recruiter not found",
        });
      }

      const subscription = await this.subscribeUC.execute({
        recruiterId,
        planId,
        razorpaySubscriptionId,
        razorpayOrderId,
        razorpayCustomerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        renewsAt: renewsAt ? new Date(renewsAt) : undefined,
        autoRenew,
        status,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: subscription,
      });
    } catch (err) {
      next(err);
    }
  };
}
