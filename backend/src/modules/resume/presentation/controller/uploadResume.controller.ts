import { Request, Response, NextFunction } from "express";
import { UploadResumeUseCase } from "../../application/usecase/UploadResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { UploadResumeDTO } from "../../application/dto/upload.resume.dto";
import { Resume } from "../../domain/entity/resume.entity";

export class UploadResumeController {
  constructor(
    private readonly uploadResumeUC: UseCase<UploadResumeDTO, Resume>,
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const file = req.file;

      if (!file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.RESUME_ID_REQUIRED,
        });
      }

      const resume = await this.uploadResumeUC.execute({
        candidateId,
        fileName: file.originalname,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RESUME_UPLOADED_SUCCESSFULLY,
        data: resume.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  };
}
