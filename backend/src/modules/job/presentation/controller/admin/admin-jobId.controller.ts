import { Request, Response, NextFunction } from "express";
import { GetJobByIdUseCase } from "../../../application/usecase/job/get-jobpost-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class AdminJobByIdController {
  constructor(private readonly getJobsIdUc: GetJobByIdUseCase) {}

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.jobPostId;

      if (!id) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Job post not found",
        });
      }

      const job = await this.getJobsIdUc.execute(id);

      res.json({
        success: true,
        message: "Job post loaded succesfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}
