import { Request, Response, NextFunction } from "express";
import { GetResumeByCandidateUseCase } from "../../application/usecase/GetResumeByCandidateUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { GetResumeByCandidateDTO } from "../../application/dto/get-resume-by-candidate.dto";
import { Resume } from "../../domain/entity/resume.entity";

export class GetResumeByCandidateController {
  constructor(
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
