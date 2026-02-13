import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { CompleteCandidateProfileUseCase } from "../../application/use-cases/complete-candidate-profile.usecase";
import { userIdSchema } from "../validator/userId.validatort";
import { completeCandidateProfileSchema } from "../validator/completeCandidateProfile-validator";

export class CandidateController {
  constructor(
    private readonly completeProfileUC: CompleteCandidateProfileUseCase,
  ) {}

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const body = completeCandidateProfileSchema.parse(req.body);
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
