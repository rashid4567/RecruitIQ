import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpdateJobPostRequestDTO } from "../../../application/dto/update-job.dto";
import { Job } from "../../../domain/entities/job.entity";
import { UpdateJobSchema } from "../../validator/UpdateJobSchema";

export class UpdateJobController {
  constructor(
    private readonly updateUc: IUseCase<UpdateJobPostRequestDTO, Job>,
  ) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("hit job update controller");
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const jobId = req.params.id;
      if (!jobId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }

      const dto = UpdateJobSchema.parse(req.body);
      const job = await this.updateUc.execute({ jobId, recruiterId, dto });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_POST_UPDATED_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      console.log("error :", err);

      next(err);
    }
  };
}
