import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetRecruiterInterviewsRequestDTO,
  GetRecruiterInterviewsResponseDTO,
} from "../../../application/dto/getRecruiter.interviews.dto";

export class GetRecruiterInterviewsController {
  constructor(
    private readonly getRecruiterInterviewsUseCase: IUseCase<
      GetRecruiterInterviewsRequestDTO,
      GetRecruiterInterviewsResponseDTO[]
    >,
  ) {}

  getRecruiterInterviews = async (
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

      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const interviews = await this.getRecruiterInterviewsUseCase.execute({
        recruiterId,
        page,
        limit,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.INTERVIEWS_FETCHED_SUCCESSFULLY,
        interviews,
      );
    } catch (error) {
      next(error);
    }
  };
}
