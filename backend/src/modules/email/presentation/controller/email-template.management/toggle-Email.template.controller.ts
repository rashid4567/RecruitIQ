import { Request, Response, NextFunction } from "express";

import { toggleEmailTemplateUseCase } from "../../../application/usecase/email-template/toggle-email-template.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class ToggleEmailTemplateController {
  constructor(private readonly toggleTemplateUC: toggleEmailTemplateUseCase) {}

  toggleEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.toggleTemplateUC.execute(req.params.id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_TEMPLATE_STATUS_UPDATED,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  };
}
