import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GetRecruiterProfileUseCase } from "../../application/useCase/get-recruiter-profile.usecase";
import { userIdSchema } from "../validator/userId.validator";

export class GetRecruiterProfileController {
  constructor(private readonly getProfileUC: GetRecruiterProfileUseCase) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = userIdSchema.parse(req.user?.userId);
        const profile = await this.getProfileUC.execute(userId);

        res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "Recruiter profile loaded",
            data : profile,
        })
    } catch (err) {
      next(err);
    }
  };
}
