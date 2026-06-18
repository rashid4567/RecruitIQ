import { Request, Response, NextFunction } from "express";
import { GetResumeByIdUseCase } from "../../application/usecase/GetResumeByIdUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";

export class GetResumeByIdController {
  constructor(private readonly getResumeByIdUC: GetResumeByIdUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resumeId } = parseResumeSchema.parse({
        resumeId: req.params.resumeId,
      });

      if (!resumeId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.RESUME_ID_REQUIRED,
        });
      }

      const resume = await this.getResumeByIdUC.execute({
        resumeId,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RESUME_LOADED_SUCCESSFULLY,
        data: resume.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  };
}
