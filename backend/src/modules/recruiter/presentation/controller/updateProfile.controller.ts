import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { userIdSchema } from "../validator/userId.validator";
import { UpdateRecruiterProfileSchema } from "../validator/updateRecruiterProfile-validator";
import { UpdateRecruiterProfileUseCase } from "../../application/useCase/update-recruiter-profile.usecase";

export class UpdateRecruiterProfileController {
  constructor(private readonly updateProfileUC: UpdateRecruiterProfileUseCase) {}

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const userId = userIdSchema.parse(req.user?.userId);
      const body = UpdateRecruiterProfileSchema.parse(req.body);
      const profile = await this.updateProfileUC.execute(userId, body)
      res.status(HTTP_STATUS.OK).json({
        success : true,
        message : "Profile update succesfully",
        data : profile,
      })
    } catch (err) {
      next(err);
    }
  };
}
