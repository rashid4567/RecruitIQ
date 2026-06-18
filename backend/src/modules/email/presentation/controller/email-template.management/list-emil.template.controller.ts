import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { GetEmailTemplatesUseCase } from "../../../application/usecase/email-template/get-email-templates.usecase";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

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
        message: SUCCESS_MESSAGES.EMAIL_TEMPLATES_LISTED_SUCCESSFULLY,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
