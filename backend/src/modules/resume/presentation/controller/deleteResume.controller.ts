import { Request, Response, NextFunction } from "express";
import { DeleteResumeUseCase } from "../../application/usecase/DeleteResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { DeleteResumeDTO } from "../../application/dto/delete-resume.dto";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";

export class DeleteResumeController {
  constructor(
    private readonly deleteResumeUC: UseCase<DeleteResumeDTO, void>,
  ) {}

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

      await this.deleteResumeUC.execute({
        resumeId,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RESUME_DELETED_SUCCESSFULLY,
      });
    } catch (err) {
      next(err);
    }
  };
}
