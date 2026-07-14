import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validatort";
import { updateCandidateProfileSchema } from "../validator/updateCandidate-validator";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  UpdateCandidateProfileRequestDTO,
  UpdateCandidateProfileResult,
} from "../../application/dto/update-candidate-profile.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";

export class UpdateCandidateProfileController {
  constructor(
    private readonly _updateProfileUC: IUseCase<
      UpdateCandidateProfileRequestDTO,
      UpdateCandidateProfileResult
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
      const input = updateCandidateProfileSchema.parse(req.body);
      if (!input) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.MISSING_FIELDS,
        );
      }
      const result = await this._updateProfileUC.execute({
        userId,
        profile: input,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
