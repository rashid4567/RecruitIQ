import { Request, Response, NextFunction } from "express";
import { ApplyJobUseCase } from "../../application/usecase/ApplyJobUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { applyJobSchema } from "../validator/apply-job.validator";

export class ApplyJobController {
  constructor(private readonly applyJobUC: ApplyJobUseCase) {}

  apply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const validatedData = applyJobSchema.parse(req.body);
      const application = await this.applyJobUC.execute({
        ...validatedData,
        candidateId,
      });

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Job application submitted successfully",
        data: application.toObject(),
      });
    } catch (err) {
      next(err);
    }
  };
}
