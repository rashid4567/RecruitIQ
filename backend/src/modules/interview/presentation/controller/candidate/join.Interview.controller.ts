import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  JoinInterviewRequestDTO,
  JoinInterviewResponseDTO,
} from "../../../application/dto/join-interview.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class JoinInterviewController {
  constructor(
    private readonly _joinInterviewUC: IUseCase<
      JoinInterviewRequestDTO,
      JoinInterviewResponseDTO
    >,
  ) {}

  join = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("HIT cadidate join interview controller")
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const { interviewId } = req.params;
      console.log("interview id ", interviewId)
      if (!interviewId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INTERVIEW_REQUIRED,
        );
      }
      const result = await this._joinInterviewUC.execute({
        interviewId,
        candidateId,
      });

      console.log("result :", result);
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CANDIDATE_JOINED_INTERVIEW_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
