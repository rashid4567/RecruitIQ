import { Request, Response, NextFunction } from "express";
import { GetRecruitersUseCase } from "../../Application/use-Cases/get-recruiters.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { VerificationStatus } from "../../Domain/entities/recruiter.entity";

export class GetRecruitersController {
  constructor(
    private readonly getRecruitersUC: GetRecruitersUseCase
  ) {}

  recruiterList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let isActive: boolean | undefined;
    if (req.query.isActive === "true") isActive = true;
    else if (req.query.isActive === "false") isActive = false;

    const result = await this.getRecruitersUC.execute({
      page,
      limit,
      search: req.query.search as string | undefined,
      verificationStatus: req.query.verificationStatus as
        VerificationStatus
        | undefined,
      subscriptionStatus: req.query.subscriptionStatus as string | undefined,
      isActive,
      sort: req.query.sort as "latest" | "oldest" | undefined,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Recruiters loaded successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

}
