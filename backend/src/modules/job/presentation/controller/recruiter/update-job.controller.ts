import { Request, Response, NextFunction } from "express";
import { UpdateJobUseCase } from "../../../application/usecase/job/update-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus"; 
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class UpdateJobController {
  constructor(private readonly updateUc: UpdateJobUseCase) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log("hit job update controller")
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
      const job = await this.updateUc.execute(jobId, recruiterId, req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_POST_UPDATED_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      console.log("error :",err);
             
      next(err);
    }
  };
}
