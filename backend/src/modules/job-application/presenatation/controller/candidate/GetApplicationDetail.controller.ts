import { Request, Response, NextFunction } from "express";
import { GetApplicationDetailUseCase } from "../../../application/usecase/candidate/GetApplicationDetailUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetApplicationDetailController {
  constructor(
    private readonly getApplicationDetailUC: GetApplicationDetailUseCase,
  ) {}

  ApplicationDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { applicationId } = req.params;

      if (!applicationId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Application required",
        });
      }
      const application = await this.getApplicationDetailUC.execute(
        candidateId,
        applicationId,
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        messaage: "Application details fetched succesfully",
        data: application,
      });
    } catch (err) {
      next(err);
    }
  };
}
