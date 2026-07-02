import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  AcceptInterviewRequestDTO,
  AcceptInterviewResponseDTO,
} from "../../../application/dto/accept-interview.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class AcceptInterviewController {
  constructor(
    private readonly acceptInterviewUC: IUseCase<
      AcceptInterviewRequestDTO,
      AcceptInterviewResponseDTO
    >,
  ) {}

  accept = async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await this.acceptInterviewUC.execute({
        interviewId,
        candidateId,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.INTERVIEW_ACCEPTED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
