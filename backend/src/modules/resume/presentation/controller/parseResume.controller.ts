import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { ParseResumeDTO } from "../../application/dto/parse.resume.dto";
import { ParsedResumeData } from "../../domain/entity/resume.entity";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class ParseResumeController {
  constructor(
    private readonly _parseResumeUC: IUseCase<ParseResumeDTO, ParsedResumeData>,
  ) {}

  parseResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        ApiResponse.error(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGE.FILE_NOT_FOUND,
        );
        return;
      }

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

      const parsedData = await this._parseResumeUC.execute({
        resumeId,
        fileBuffer: file.buffer,
        mimeType: file.mimetype,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RESUME_PARSED_SUCCESSFULLY,
        parsedData,
      );
    } catch (err) {
      next(err);
    }
  };
}
