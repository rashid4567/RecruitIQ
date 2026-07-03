import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpdateJobPostRequestDTO } from "../../../application/dto/update-job.dto";
import { Job } from "../../../domain/entities/job.entity";
import { UpdateJobSchema } from "../../validator/UpdateJobSchema";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class UpdateJobController {
  constructor(
    private readonly _updateUc: IUseCase<UpdateJobPostRequestDTO, Job>,
  ) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const jobId = req.params.id;
      if (!jobId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGE.JOB_ID_REQUIRED,
        );
      }

      const dto = UpdateJobSchema.parse(req.body);
      const job = await this._updateUc.execute({ jobId, recruiterId, dto });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_POST_UPDATED_SUCCESSFULLY,
        job,
      );
    } catch (err) {
      next(err);
    }
  };
}
