import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { UploadResumeDTO } from "../../application/dto/upload.resume.dto";
import { Resume } from "../../domain/entity/resume.entity";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class UploadResumeController {
  constructor(
    private readonly uploadResumeUC: IUseCase<UploadResumeDTO, Resume>,
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {

        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        )
      }

      const file = req.file;

      if (!file) {

        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.RESUME_ID_REQUIRED,
        )
      }

      const resume = await this.uploadResumeUC.execute({
        candidateId,
        fileName: file.originalname,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RESUME_UPLOADED_SUCCESSFULLY,
        resume.toJSON()
      )

    } catch (err) {
      next(err);
    }
  };
}
