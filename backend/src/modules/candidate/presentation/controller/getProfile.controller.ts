import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validatort";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { GetCandidateProfileRequestDTO, GetCandidateProfileResponseDTO } from "../../application/dto/candidate-profile.dto";

export class GetCandidateProfileController {
  constructor(private readonly getProfileUC: UseCase<
    GetCandidateProfileRequestDTO,
    GetCandidateProfileResponseDTO
  >) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      if(!userId){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success : false,
          message : ERROR_MESSAGE.UNAUTHORIZED
        })
      }
      const profile = await this.getProfileUC.execute({userId});

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANDIDATE_PROFILE_LOADED_SUCCESSFULLY,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
