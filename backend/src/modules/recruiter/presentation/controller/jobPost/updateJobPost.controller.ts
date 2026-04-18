import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { UpdateJobPostUseCase } from "../../../application/useCase/jobPost/UpdateJobPost";

export class UpdateJobPostController {
  constructor(private readonly updatePostUc: UpdateJobPostUseCase) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Job ID is required",
        });
      }

      const jobPost = await this.updatePostUc.execute(
        id,
        recruiterId,
        req.body,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job post updated successfully",
        data: jobPost,
      });
    } catch (err) {
      next(err);
    }
  };
}
