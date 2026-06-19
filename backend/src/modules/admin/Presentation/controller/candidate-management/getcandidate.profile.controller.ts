import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { GetCandidateprofileUseCase } from "../../../Application/use-Cases/candidate-management/get-candidate-profile.usecase";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateProfileRequestDTO,
  CandidateProfileResponseDTO,
} from "../../../Application/dto/candidate.dto/candidate-profile-response.dto";

export class GetCandidateProfileController {
  constructor(
    private readonly getCandidteProfileUC: UseCase<
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
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const profile = await this.getCandidteProfileUC.execute({ candidateId });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANDIDATE_PROFILE_LOADED_SUCCESSFULLY,
        data: profile,
      });
    } catch (err) {
      console.log("err", err);
      return next(err);
    }
  };
}
