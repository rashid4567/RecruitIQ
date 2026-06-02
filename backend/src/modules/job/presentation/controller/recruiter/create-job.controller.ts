import { Request, Response, NextFunction } from "express";
import { CreateJobUseCase } from "../../../application/usecase/job/create-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { CreateJobSchema } from "../../validator/create.jobpost.validation";

export class CreateJobController {
  constructor(private readonly createUc: CreateJobUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const dto = CreateJobSchema.parse(req.body)

      const job = await this.createUc.execute(recruiterId, dto);
      console.log("job :", job);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (err) {
        console.log("err", err);
      next(err);
    }
  };
}
