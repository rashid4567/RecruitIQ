import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetRecruiterHiringDecisionDetailsRequestDTO,
  RecruiterHiringDecisionDetailsResponseDTO,
} from "../../../../interview/application/dto/GetRecruiterHiringDecisionDetails.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class GetRecruiterHiringDecisionDetailsController {
  constructor(
    private readonly _getRecruiterHiringDecisionDetailsUC: IUseCase<
      GetRecruiterHiringDecisionDetailsRequestDTO,
      RecruiterHiringDecisionDetailsResponseDTO
    >,
  ) {}

  getHiringDecisionDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
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

      const result = await this._getRecruiterHiringDecisionDetailsUC.execute({
        recruiterId,
        interviewId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.HIRING_DECISION_DATA_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
