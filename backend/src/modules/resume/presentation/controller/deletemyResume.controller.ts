import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

import { DeleteResumeUseCase } from "../../application/usecase/DeleteResumeUseCase";
import { GetResumeByCandidateUseCase } from "../../application/usecase/GetResumeByCandidateUseCase";

export class DeleteMyResumeController {
  constructor(
    private readonly deleteResumeUC: DeleteResumeUseCase,
    private readonly getResumeByCandidateUC: GetResumeByCandidateUseCase,
  ) {}

  handle = async (
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

      const resume =
        await this.getResumeByCandidateUC.execute({
          candidateId,
        });

      await this.deleteResumeUC.execute({
        resumeId: resume.getId()!,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Resume deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}