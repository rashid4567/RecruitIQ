import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateInterviewDetailsRequestDTO,
  CandidateInterviewDetailsResponseDTO,
} from "../../../application/dto/getCandidateInterviews.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class GetCandidateInterviewDetailsController {
  constructor(
    private readonly _getInterviewDetailsUC: IUseCase<
      CandidateInterviewDetailsRequestDTO,
      CandidateInterviewDetailsResponseDTO
    >,
  ) {}

  getDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const { interviewId } = req.params;
      if (!interviewId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INTERVIEW_REQUIRED,
        );
      }

      const result = await this._getInterviewDetailsUC.execute({
        interviewId,
        candidateId,
      });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CANDIDATE_INTERVIEW_DETAIL_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
