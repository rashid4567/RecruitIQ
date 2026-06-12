import { Request, Response, NextFunction } from "express";
import { DeleteResumeUseCase } from "../../application/usecase/DeleteResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";

export class DeleteResumeController {
  constructor(private readonly deleteResumeUC: DeleteResumeUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resumeId } =  parseResumeSchema.parse({
              resumeId: req.params.resumeId,
            });

      if (!resumeId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Resume id is required",
        });
      }

      await this.deleteResumeUC.execute({
        resumeId,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Resume deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
