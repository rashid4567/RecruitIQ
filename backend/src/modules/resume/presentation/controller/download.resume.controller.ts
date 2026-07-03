import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { DownloadResumeDTO } from "../../application/dto/download.resume.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class DownloadResumeController {
  constructor(
    private readonly _downloadResumeUC: IUseCase<DownloadResumeDTO, string>,
  ) {}

  downloadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resumeId } = parseResumeSchema.parse({
        resumeId: req.params.resumeId,
      });

      if (!resumeId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.RESUME_ID_REQUIRED,
        );
      }

      const downloadUrl = await this._downloadResumeUC.execute({ resumeId });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RESUME_DOWNLOADED_SUCCESSFULLY,
        downloadUrl,
      );
    } catch (err) {
      next(err);
    }
  };
}
