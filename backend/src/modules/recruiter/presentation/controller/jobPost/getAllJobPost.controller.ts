import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { GetRecruiterJobPostsUseCase } from "../../../application/useCase/jobPost/GetRecruiterJobPostsUseCase";

export class GetAllRecruiterController {
  constructor(private readonly getAllJobPost: GetRecruiterJobPostsUseCase) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const jobPosts = await this.getAllJobPost.execute(recruiterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job posts fetched successfully",
        data: jobPosts,
      });
    } catch (err) {
      next(err);
    }
  };
}
