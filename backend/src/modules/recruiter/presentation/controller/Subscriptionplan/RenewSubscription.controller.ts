import { Request, Response, NextFunction } from "express";
import { RenewSubscriptionUseCase } from "../../../application/useCase/subscription.plans/Renewsubscription.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { renewSubscriptionSchema } from "../../validator/RenewSubscription.validator";
export class RenewSubscriptionController {
  constructor(
    private readonly renewSubscriptionUC: RenewSubscriptionUseCase
  ) {}

  renewSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const {
        newStartDate,
        newEndDate,
        newRenewsAt,
      } = renewSubscriptionSchema.parse(req.body);

      const { subscriptionId } = req.params;

      if (!subscriptionId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Subscription ID is required",
        });

        return;
      }

      
      const subscription =
        await this.renewSubscriptionUC.execute({
          subscriptionId,
          newStartDate: new Date(newStartDate),
          newEndDate: new Date(newEndDate),
          newRenewsAt: newRenewsAt
            ? new Date(newRenewsAt)
            : undefined,
        });

   
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription renewed successfully",
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };
}