import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateProfileRequestDTO,
  CandidateProfileResponseDTO,
} from "../../../Application/dto/candidate.dto/candidate-profile-response.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class GetCandidateProfileController {
  constructor(
    private readonly _getCandidteProfileUC: IUseCase<
      CandidateProfileRequestDTO,
      CandidateProfileResponseDTO
    >,
  ) {}

  getCandidateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { candidateId } = req.params;
      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        )
      }
      const profile = await this._getCandidteProfileUC.execute({ candidateId });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CANDIDATE_PROFILE_LOADED_SUCCESSFULLY,
        profile,
      )
    } catch (err) {
      console.log("err", err);
      return next(err);
    }
  };
}
