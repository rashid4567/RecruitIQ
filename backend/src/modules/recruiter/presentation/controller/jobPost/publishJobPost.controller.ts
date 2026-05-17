import { Request, Response, NextFunction } from "express";
import { PublishJobPostUseCase } from "../../../application/useCase/jobPost/publish.jobPost.useCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class PublishJobPostController {
  constructor(
    private readonly publishJobPostUc: PublishJobPostUseCase
  ) {}

  public publish = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const jobpostId = req.params.id;

      if (!jobpostId) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Jobpost not found",
        });

        return;
      }

      const recruiterId = req.user?.userId; 

      if (!recruiterId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "User not found",
        });

        return;
      }

      const result = await this.publishJobPostUc.execute(
        jobpostId,
        recruiterId
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job post published successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}