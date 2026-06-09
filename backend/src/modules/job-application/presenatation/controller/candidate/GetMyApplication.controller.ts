import { Request, Response, NextFunction } from "express";
import { GetMyApplicationUseCase } from "../../../application/usecase/candidate/GetMyApplicationsUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetMyApplicationController {
  constructor(private readonly getMyApplicationUC: GetMyApplicationUseCase) {}

  getMyApplication = async (
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

      const application = await this.getMyApplicationUC.execute(candidateId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Application loaded succesfully",
        data : application.map((app)=>
            app.toObject(),
        )
      });
    } catch (err) {
      next(err);
    }
  };
}
