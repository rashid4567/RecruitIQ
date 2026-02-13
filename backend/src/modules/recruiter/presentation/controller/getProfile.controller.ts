import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GetRecruiterProfileUseCase } from "../../application/useCase/get-recruiter-profile.usecase";
import { userIdSchema } from "../validator/userId.validator";
// import { logger } from "../../../../shared/logger/logger";

export class GetRecruiterProfileController {
  constructor(private readonly getProfileUC: GetRecruiterProfileUseCase) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("user :",  req.user);
      const userId = userIdSchema.parse(req.user?.userId);
      if(!userId){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success : false,
          message : "Unauthorized"
        })
      }
      const profile = await this.getProfileUC.execute(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Recruiter profile loaded",
        data: profile,
      });
    } catch (err) {
     // logger.error(err);
      next(err);
    }
  };
}
