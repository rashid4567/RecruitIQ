import { Request, Response, NextFunction } from "express";
import { GetRecruiterProfileUseCase } from "../../../Application/use-Cases/recruiter-management/get-recruiter-profile.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

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

      const recruiter = await this.getRecruiterProfileUC.execute(recruiterId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Recruiter profile loaded successfully",
        data: recruiter,
      });
    } catch (err) {
      return next(err);
    }
  };
}
