import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { userIdSchema } from "../validator/userId.validator";
import { CompleteRecruiterProfileSchema } from "../validator/completeRecruiterProfile-validator";
import { CompleteRecruiterProfileUseCase } from "../../application/useCase/complete-recruiter-profile.usecase";


export class CompleteRecruiterProfileController {
  constructor(

    private readonly completeProfileUC: CompleteRecruiterProfileUseCase,

  ) {}


  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const body = CompleteRecruiterProfileSchema.parse(req.body);

      const profile = await this.completeProfileUC.execute(userId, body)
      res.status(HTTP_STATUS.OK).json({
        success : true,
        message : "Profle completed succesfully",
        data : profile,
      })
    } catch (err) {
      next(err);
    }
  };

}
