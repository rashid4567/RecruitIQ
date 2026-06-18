import { Request, Response, NextFunction } from "express";
import { DeleteJobUseCase } from "../../../application/usecase/job/delete-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class DeleteJobController {
  constructor(private readonly deleteUC: DeleteJobUseCase) {}

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const jobId = req.params.id;

      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          mesasge: ERROR_MESSAGE.JOB_POST_IS_REQUIRED,
        });
      }
      await this.deleteUC.execute(jobId, recruiterId);
      res.status(HTTP_STATUS.OK).json({
        success: false,
        message: SUCCESS_MESSAGES.JOB_DELETED_SUCCESSFULLY,
      });
    } catch (err) {
      console.log("error :", err);
      next(err);
    }
  };
}
