import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateProfileRequestDTO,
  CandidateProfileResponseDTO,
} from "../../../Application/dto/candidate.dto/candidate-profile-response.dto";

export class GetCandidateProfileController {
  constructor(
    private readonly getCandidteProfileUC: IUseCase<
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
