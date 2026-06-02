import { Request, Response, NextFunction } from "express";
import { GetResumeDownLoadUrlUseCase } from "../../application/usecase/GetResumeDownloadUrlUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class GetResumeDownloadUrlController {
  constructor(
    private readonly getResumeDownloadUrlUC: GetResumeDownLoadUrlUseCase,
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const url = await this.getResumeDownloadUrlUC.execute({
        candidateId,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Resume Downloaded succesfully",
        data: url,
      });
    } catch (err) {
      next(err);
    }
  };
}
