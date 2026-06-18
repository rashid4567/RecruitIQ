import { Request, Response, NextFunction } from "express";
import { DownloadResumeUseCase } from "../../application/usecase/DownloadResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";

export class DownloadResumeController {
  constructor(private readonly downloadResumeUC: DownloadResumeUseCase) {}

  downloadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resumeId } = parseResumeSchema.parse({
        resumeId: req.params.resumeId,
      });

      if (!resumeId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.RESUME_ID_REQUIRED,
        });
      }

      const downloadUrl = await this.downloadResumeUC.execute(resumeId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RESUME_DOWNLOADED_SUCCESSFULLY,
        data: downloadUrl,
      });
    } catch (err) {
      next(err);
    }
  };
}
