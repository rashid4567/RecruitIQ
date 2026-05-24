import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { GetJobPostByIdUseCase } from "../../../application/useCase/jobPost/GetJobPostByIdUseCase";

export class GetJobPostByIdController {
  constructor(private readonly getJobPostByIdUseCase: GetJobPostByIdUseCase) {}

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      const { id } = req.params;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const jobPost = await this.getJobPostByIdUseCase.execute(id, recruiterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: jobPost,
      });
    } catch (err) {
      next(err);
    }
  };
}
