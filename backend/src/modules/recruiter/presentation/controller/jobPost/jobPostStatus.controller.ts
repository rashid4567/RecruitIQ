import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ToggleJobPostVisibilityUseCase } from "../../../application/useCase/jobPost/ToggleJobPostVisibility";

export class UpdateJobPostStatusController {
  constructor(private readonly toggleJobPost: ToggleJobPostVisibilityUseCase) {}

  hide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { id } = req.params;

      const jobPost = await this.toggleJobPost.execute(id, recruiterId, true);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job post hidden successfully",
        data: jobPost,
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
          message: "Unauthorized",
        });
      }

      const { id } = req.params;

      const jobPost = await this.toggleJobPost.execute(id, recruiterId, false);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job post unhidden successfully",
        data: jobPost,
      });
    } catch (err) {
      next(err);
    }
  };
}
