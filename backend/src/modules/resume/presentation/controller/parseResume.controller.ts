import { Request, Response, NextFunction } from "express";
import { ParseResumeUseCase } from "../../application/usecase/ParseResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { parseResumeSchema } from "../validatior/parseResume.schema";

export class ParseResumeController {
  constructor(private readonly parseResumeUC: ParseResumeUseCase) {}

  parseResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("hit resume parse service")
      const file = req.file;

      if (!file) {
         res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Resume file is required",
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
        message: "Resume parsed succesfully",
        data: parsedData,
      });
    } catch (err) {
      next(err);
    }
  };
}
