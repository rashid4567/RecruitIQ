import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { UpdateCandidateProfileUseCase } from "../../application/use-cases/profile/update-candidate-profile.usecase";
import { userIdSchema } from "../validator/userId.validatort";
import { updateCandidateProfileSchema } from "../validator/updateCandidate-validator";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  UpdateCandidateProfileRequestDTO,
  UpdateCandidateProfileResult,
} from "../../application/dto/update-candidate-profile.dto";

export class UpdateCandidateProfileController {
  constructor(
    private readonly updateProfileUC: UseCase<
      UpdateCandidateProfileRequestDTO,
      UpdateCandidateProfileResult
    >,
  ) {}

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const input = updateCandidateProfileSchema.parse(req.body);
      console.log("input :-", input);
      const result = await this.updateProfileUC.execute({
        userId,
        profile: input,
      });
      console.log("result :-", result);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      console.log("Error :-", err);
      next(err);
    }
  };
}
