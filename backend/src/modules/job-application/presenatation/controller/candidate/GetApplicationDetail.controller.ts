import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  ApplicationDetailResponseDTO,
  GetApplicationDetailRequestDTO,
} from "../../../application/dto/application-detail.response.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class GetApplicationDetailController {
  constructor(
    private readonly getApplicationDetailUC: IUseCase<
      GetApplicationDetailRequestDTO,
      ApplicationDetailResponseDTO
    >,
  ) {}

  ApplicationDetail = async (
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

      const { applicationId } = req.params;
      if (!applicationId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.APPLICATION_REQUIRED,
        );
      }
      const application = await this.getApplicationDetailUC.execute({
        candidateId,
        applicationId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.APPLICATION_LOADED_SUCCESSFULLY,
        application,
      );
    } catch (err) {
      next(err);
    }
  };
}
