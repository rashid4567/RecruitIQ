import { Request, Response, NextFunction } from "express";


import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { CreateEmailTemplateUseCase } from "../../../Application/use-Cases/email-template/create-email-template.usecase";

export class CreateEmailTemplateController {
  constructor(
    private readonly createEmailTemplateUC: CreateEmailTemplateUseCase
  ) {}

  createEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.createEmailTemplateUC.execute(req.body);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Email template created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
