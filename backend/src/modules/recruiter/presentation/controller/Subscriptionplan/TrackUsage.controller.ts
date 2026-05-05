
import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { TrackUsageUseCase } from "../../../application/useCase/subscription.plans/Trackusage.usecase";
import { trackUsageSchema } from "../../validator/TrackUsage.validator";


export class TrackUsageController {
  constructor(private readonly trackUsageUC: TrackUsageUseCase) {}

  trackUsage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobPostDelta, screeningCreditDelta } = trackUsageSchema.parse(req.body);
      const recruiterId = req.params.recruiterId;

      const subscription = await this.trackUsageUC.execute({
        recruiterId,
        jobPostDelta,
        screeningCreditDelta,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Usage tracked successfully",
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };
}