import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { DownloadResumeDTO } from "../../application/dto/download.resume.dto";

export class DownloadResumeController {
  constructor(
    private readonly downloadResumeUC: IUseCase<DownloadResumeDTO, string>,
  ) {}

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

      const downloadUrl = await this.downloadResumeUC.execute({ resumeId });

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
