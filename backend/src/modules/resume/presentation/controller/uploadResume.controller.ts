import { Request, Response, NextFunction } from "express";
import { UploadResumeUseCase } from "../../application/usecase/UploadResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class UploadResumeController {
  constructor(private readonly uploadResumeUC: UploadResumeUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;

      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const file = req.file;

      if (!file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Resume is required",
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
        message: "Resume uploaded successfully",
        data: resume.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  };
}
