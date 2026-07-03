import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { GetResumeByCandidateDTO } from "../../application/dto/get-resume-by-candidate.dto";
import { Resume } from "../../domain/entity/resume.entity";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class GetResumeByCandidateController {
  constructor(
    private readonly _getResumeByCandidateUC: IUseCase<
      GetResumeByCandidateDTO,
      Resume
    >,
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const resume = await this._getResumeByCandidateUC.execute({
        candidateId,
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
