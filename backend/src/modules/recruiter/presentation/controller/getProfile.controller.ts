import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validator";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  GetRecruiterProfileRequestDTO,
  RecruiterProfileReponse,
} from "../../application/dto/recruiter-profile.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class GetRecruiterProfileController {
  constructor(
    private readonly _getProfileUC: IUseCase<
      GetRecruiterProfileRequestDTO,
      RecruiterProfileReponse
    >,
  ) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      if (!userId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const profile = await this._getProfileUC.execute({ userId });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RECRUITER_PROFILE_LOADED_SUCCESSFULLY,
        profile,
      );
    } catch (err) {
      next(err);
    }
  };
}
