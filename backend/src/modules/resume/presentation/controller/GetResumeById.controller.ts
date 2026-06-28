import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { GetResumeByIdDTO } from "../../application/dto/getResumeByid.dto";
import { Resume } from "../../domain/entity/resume.entity";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class GetResumeByIdController {
  constructor(
    private readonly getResumeByIdUC: IUseCase<GetResumeByIdDTO, Resume>,
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resumeId } = parseResumeSchema.parse({
        resumeId: req.params.resumeId,
      });

      if (!resumeId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.RESUME_ID_REQUIRED,
        );
      }

      const resume = await this.getResumeByIdUC.execute({
        resumeId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RESUME_LOADED_SUCCESSFULLY,
        resume.toJSON(),
      );
    } catch (err) {
      next(err);
    }
  };
}
