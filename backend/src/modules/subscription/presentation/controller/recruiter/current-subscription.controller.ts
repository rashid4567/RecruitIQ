import { Request, Response, NextFunction } from "express";
import { GetCurrentSubscriptionUseCase } from "../../../application/usecase/Recruiter/GetCurrentSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class CurrentSubscriptionController {
  constructor(private readonly currentUC: GetCurrentSubscriptionUseCase) {}

  current = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "UnAuthorized",
        });
      }
      const result = await this.currentUC.execute(recruiterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,

        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
