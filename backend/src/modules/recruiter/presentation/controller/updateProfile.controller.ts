import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validator";
import { UpdateRecruiterProfileSchema } from "../validator/updateRecruiterProfile-validator";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { UpdateRecruiterProfileRequestDTO } from "../../application/dto/update-recruiter-profile.dto";
import { RecruiterProfileReponse } from "../../application/dto/recruiter-profile.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class UpdateRecruiterProfileController {
  constructor(
    private readonly _updateProfileUC: IUseCase<
      UpdateRecruiterProfileRequestDTO,
      RecruiterProfileReponse
    >,
  ) {}

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);

      if (!userId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const body = UpdateRecruiterProfileSchema.parse(req.body);

      if (!body) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.MISSING_FIELDS,
        );
      }
      const profile = await this._updateProfileUC.execute({
        userId,
        input: body,
      });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
      );
    } catch (err) {
      next(err);
    }
  };
}
