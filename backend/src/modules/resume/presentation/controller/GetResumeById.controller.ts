import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { GetResumeByIdDTO } from "../../application/dto/getResumeByid.dto";
import { Resume } from "../../domain/entity/resume.entity";

export class GetResumeByIdController {
  constructor(private readonly getResumeByIdUC: UseCase<GetResumeByIdDTO, Resume>) {}

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
