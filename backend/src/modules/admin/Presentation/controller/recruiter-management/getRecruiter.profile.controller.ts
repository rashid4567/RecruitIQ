import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  RecruiterProfileOutput,
  RecruiterProfileRequestDTO,
} from "../../../Application/dto/recruiter.dto/recruiter-profile.output";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class GetRecruiterProfileController {
  constructor(
    private readonly _getRecruiterProfileUC: IUseCase<
      RecruiterProfileRequestDTO,
      RecruiterProfileOutput
    >,
  ) {}

  getRecruiterProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { recruiterId } = req.params;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const recruiter = await this._getRecruiterProfileUC.execute({
        recruiterId,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RECRUITER_PROFILE_LOADED_SUCCESSFULLY,
        recruiter,
      );
    } catch (err) {
      return next(err);
    }
  };
}
