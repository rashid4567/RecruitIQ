import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { DeleteResumeDTO } from "../../application/dto/delete-resume.dto";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class DeleteResumeController {
  constructor(
    private readonly deleteResumeUC: IUseCase<DeleteResumeDTO, void>,
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resumeId } = parseResumeSchema.parse({
        resumeId: req.params.resumeId,
      });

      if (!resumeId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      await this.deleteResumeUC.execute({
        resumeId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RESUME_DELETED_SUCCESSFULLY,
      );
    } catch (err) {
      next(err);
    }
  };
}
