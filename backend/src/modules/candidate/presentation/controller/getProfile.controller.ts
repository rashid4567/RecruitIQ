import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validatort";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  GetCandidateProfileRequestDTO,
  GetCandidateProfileResponseDTO,
} from "../../application/dto/candidate-profile.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class GetCandidateProfileController {
  constructor(
    private readonly getProfileUC: IUseCase<
      GetCandidateProfileRequestDTO,
      GetCandidateProfileResponseDTO
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
      const profile = await this.getProfileUC.execute({ userId });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CANDIDATE_PROFILE_LOADED_SUCCESSFULLY,
        profile,
      );
    } catch (err) {
      next(err);
    }
  };
}
