import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ToggleEmailTemplateRequestDTO } from "../../../application/dto/email.template/toggleEmail.template.input.dto";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";

export class ToggleEmailTemplateController {
  constructor(private readonly toggleTemplateUC: UseCase<
    ToggleEmailTemplateRequestDTO,
    EmailTemplate
  >) {}

  toggleEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const result = await this.toggleTemplateUC.execute({id});

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
