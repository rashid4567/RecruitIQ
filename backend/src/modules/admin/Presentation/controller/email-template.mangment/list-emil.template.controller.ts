import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { GetEmailTemplatesUseCase } from
  "../../../Application/use-Cases/email-template/get-email-templates.usecase";

export class ListEmailTemplateController {
  constructor(
    private readonly getEmailTemplatesUC: GetEmailTemplatesUseCase
  ) {}

  listEmailTemplates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.getEmailTemplatesUC.execute();

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Email templates listed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
