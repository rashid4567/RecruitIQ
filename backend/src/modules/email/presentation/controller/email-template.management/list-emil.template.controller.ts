import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";

export class ListEmailTemplateController {
  constructor(
    private readonly getEmailTemplatesUC: UseCase<void, EmailTemplate[]>,
  ) {}

  listEmailTemplates = async (
    req: Request,
    res: Response,
    next: NextFunction,
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
