import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetRecruiterInterviewDetailsRequestDTO,
  GetRecruiterInterviewDetailsResponseDTO,
} from "../../../application/dto/getRecruiterInterview.details.dto";

export class GetRecruiterInterviewDetailsController {
  constructor(
    private readonly _getRecruiterInterviewDetailsUseCase: IUseCase<
      GetRecruiterInterviewDetailsRequestDTO,
      GetRecruiterInterviewDetailsResponseDTO
    >,
  ) {}

  getRecruiterInterviewDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
        return;
      }

      const { interviewId } = req.params;
      if (!interviewId?.trim()) {
        ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INTERVIEW_REQUIRED,
        );
        return;
      }

      const interview = await this._getRecruiterInterviewDetailsUseCase.execute({
        recruiterId,
        interviewId,
      });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.INTERVIEW_FETCHED_SUCCESSFULLY,
        interview,
      );
    } catch (error) {
      next(error);
    }
  };
}
