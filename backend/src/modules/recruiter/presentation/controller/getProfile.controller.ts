import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GetRecruiterProfileUseCase } from "../../application/useCase/profile/get-recruiter-profile.usecase";
import { userIdSchema } from "../validator/userId.validator";

export class GetRecruiterProfileController {
  constructor(private readonly getProfileUC: GetRecruiterProfileUseCase) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const userId = userIdSchema.parse(req.user?.userId);
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const profile = await this.getProfileUC.execute(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Recruiter profile loaded",
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
