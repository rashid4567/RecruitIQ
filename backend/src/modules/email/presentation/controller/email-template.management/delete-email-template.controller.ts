import { Request, Response, NextFunction } from "express";
import { DeleteEmailTemplateUseCase } from "../../../application/usecase/email-template/delete-email-template.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class DeleteEmailTemplateController {
  constructor(private readonly DeleteTemplateUC: DeleteEmailTemplateUseCase) {}

  deleteEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.DeleteTemplateUC.execute(req.params.id);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TEMPLATE_DELETED_SUCCESSFULLY,
      });
    } catch (err) {
      return next(err);
    }
  };
}
