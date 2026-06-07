import { Request, Response, NextFunction } from "express";
import { DownloadResumeUseCase } from "../../application/usecase/DownloadResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class DownloadResumeController {
  constructor(private readonly downloadResumeUC: DownloadResumeUseCase) {}

  downloadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resumeId } = req.params;

      if (!resumeId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Resume is required",
        });
      }

      const downloadUrl = await this.downloadResumeUC.execute(resumeId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Resume dowloaded succesfully",
        data: downloadUrl,
      });
    } catch (err) {
      next(err);
    }
  };
}
