import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { CompleteCandidateProfileUseCase } from "../../application/use-cases/profile/complete-candidate-profile.usecase";
import { userIdSchema } from "../validator/userId.validatort";
import { completeCandidateProfileSchema } from "../validator/completeCandidateProfile-validator";

export class CandidateController {
  constructor(
    private readonly completeProfileUC: CompleteCandidateProfileUseCase,
  ) {}

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);

      if(!userId){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success : false,
          message : "Unauthorized"
        })
      }
      const body = completeCandidateProfileSchema.parse(req.body);

      if(!body){
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success : false,
          message : "Missing fileds"
        })
      }
      const profile = await this.completeProfileUC.execute(userId, body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Profile completed successfully",
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
