import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { CreateJobPostUseCase } from "../../../../job/application/usecase/job/createJobPost.useCase";

export class CreateJobPostController {
  constructor(private readonly createUc: CreateJobPostUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const jobPost = await this.createUc.execute(recruiterId, req.body);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Job post created successfully",
        data: jobPost,
      });
    } catch (err) {
      next(err);
    }
  };
}
