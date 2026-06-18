import { Request, Response, NextFunction } from "express";
import { GetRecruiterProfileUseCase } from "../../../Application/use-Cases/recruiter-management/get-recruiter-profile.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";

export class GetRecruiterProfileController {
  constructor(
    private readonly getRecruiterProfileUC: GetRecruiterProfileUseCase,
  ) {}

  getRecruiterProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { recruiterId } = req.params;
      if(!recruiterId){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success : false,
          message : ERROR_MESSAGE.UNAUTHORIZED,
        })
      }
      const recruiter = await this.getRecruiterProfileUC.execute(recruiterId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RECRUITER_PROFILE_LOADED_SUCCESFULLY, 
        data: recruiter,
      });
    } catch (err) {
      return next(err);
    }
  };
}
