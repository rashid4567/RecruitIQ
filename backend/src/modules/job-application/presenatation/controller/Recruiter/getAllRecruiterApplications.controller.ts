import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetRecruiterApplicationsRequestDTO,
  GetRecruiterApplicationsResponseDTO,
} from "../../../application/dto/getRecrruiterApplication.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import {
  ApplicationRecommendation,
  ApplicationStatus,
} from "../../../domain/entity/job-application.entity";

export class GetAllApplicationRecruiterController {
  constructor(
    private readonly getAllRecruiterApplicationUC: IUseCase<
      GetRecruiterApplicationsRequestDTO,
      GetRecruiterApplicationsResponseDTO
    >,
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.UNAUTHORIZED,
        );
      }

      const request: GetRecruiterApplicationsRequestDTO = {
        recruiterId,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string,
        status: req.query.status as ApplicationStatus,
        recommendation: req.query.recommendation as ApplicationRecommendation,
        sortBy: req.query.sortBy as "appliedAt" | "candidateName" | "aiScore",
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };

      const result = await this.getAllRecruiterApplicationUC.execute(request);

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.APPLICATIONS_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
