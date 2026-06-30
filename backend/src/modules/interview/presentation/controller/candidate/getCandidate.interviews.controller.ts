import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetCandidateInterviewsRequestDTO,
  GetCandidateInterviewsResponseDTO,
} from "../../../application/dto/getCandidateInterviews.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class GetCandidateInterviewsController {
  constructor(
    private readonly getCandidateInterviewsUC: IUseCase<
      GetCandidateInterviewsRequestDTO,
      GetCandidateInterviewsResponseDTO
    >,
  ) {}

  candidateInterviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const result = await this.getCandidateInterviewsUC.execute({
        candidateId,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CANDIDATE_INTERVIEWS_LOADED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
