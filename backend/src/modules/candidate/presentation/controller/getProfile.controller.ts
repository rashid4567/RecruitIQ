import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GetCandidateProfileUseCase } from "../../application/use-cases/profile/get-candidate-profile.usecase";
import { userIdSchema } from "../validator/userId.validatort";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";

export class GetCandidateProfileController {
  constructor(private readonly getProfileUC: GetCandidateProfileUseCase) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      if(!userId){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success : false,
          message : ERROR_MESSAGE.UNAUTHORIZED
        })
      }
      const profile = await this.getProfileUC.execute(userId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANDIDATE_PROFILE_lOADED_SUCCESFULLY,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
