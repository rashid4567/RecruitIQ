import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { ParseResumeDTO } from "../../application/dto/parse.resume.dto";
import { ParsedResumeData } from "../../domain/entity/resume.entity";

export class ParseResumeController {
  constructor(private readonly parseResumeUC: IUseCase<
    ParseResumeDTO,
    ParsedResumeData
  >) {}

  parseResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("hit resume parse service");
      const file = req.file;

      if (!file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
        return;
      }

      const { resumeId } = parseResumeSchema.parse({
        resumeId: req.params.resumeId,
      });

      const parsedData = await this.parseResumeUC.execute({
        resumeId,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RESUME_PARSED_SUCCESSFULLY,
        data: parsedData,
      });
    } catch (err) {
      next(err);
    }
  };
}
