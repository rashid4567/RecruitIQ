import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GetCandidateProfileUseCase } from "../../application/use-cases/get-candidate-profile.usecase";
import { userIdSchema } from "../validator/userId.validatort";

export class getCandidateProfileController {
  constructor(private readonly getProfileUC: GetCandidateProfileUseCase) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const profile = await this.getProfileUC.execute(userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Candidate profile loaded",
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
