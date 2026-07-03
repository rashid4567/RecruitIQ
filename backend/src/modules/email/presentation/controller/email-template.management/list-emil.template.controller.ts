import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class ListEmailTemplateController {
  constructor(
    private readonly _getEmailTemplatesUC: IUseCase<void, EmailTemplate[]>,
  ) {}

  listEmailTemplates = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this._getEmailTemplatesUC.execute();
    
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.EMAIL_TEMPLATES_LISTED_SUCCESSFULLY,
        result,
      )
    } catch (error) {
      next(error);
    }
  };
}
