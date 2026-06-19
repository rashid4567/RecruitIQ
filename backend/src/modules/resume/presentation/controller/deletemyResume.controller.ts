import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { DeleteResumeDTO } from "../../application/dto/delete-resume.dto";
import { GetResumeByCandidateDTO } from "../../application/dto/get-resume-by-candidate.dto";
import { Resume } from "../../domain/entity/resume.entity";

export class DeleteMyResumeController {
  constructor(
    private readonly deleteResumeUC: UseCase<DeleteResumeDTO, void>,
    private readonly getResumeByCandidateUC: UseCase<
      GetResumeByCandidateDTO,
      Resume
    >,
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const resume = await this.getResumeByCandidateUC.execute({
        candidateId,
      });

      await this.deleteResumeUC.execute({
        resumeId: resume.getId()!,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RESUME_DELETED_SUCCESSFULLY,
      });
    } catch (error) {
      next(error);
    }
  };
}
