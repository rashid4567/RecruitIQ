import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { HideJobUseCase } from "../../../application/usecase/job/hide-job.usecase";
import { UnhideJobUseCase } from "../../../application/usecase/job/unhide-job.post.usecase";

export class ToggleJobVisibilityController {
  constructor(
    private readonly hideUC: HideJobUseCase,
    private readonly unhideUC: UnhideJobUseCase,
  ) {}

  hide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorizes",
        });
      }
      const job = await this.hideUC.execute(req.params.id, recruiterId!);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job hidden",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };

  unhide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorizes",
        });
      }
      const job = await this.unhideUC.execute(req.params.id, recruiterId!);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job unhidden",
        data: job,
      });
    } catch (err) {
      console.log("error :",err);
            
      next(err);
    }
  };
}
