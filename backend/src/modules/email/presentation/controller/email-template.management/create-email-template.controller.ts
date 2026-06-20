import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { CreateEmailTemplateUseCase } from "../../../application/usecase/email-template/create-email-template.usecase";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CreateEmailTemplateInputDto } from "../../../application/dto/email.template/createEmailTemplate.input.dto";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";

export class CreateEmailTemplateController {
  constructor(
    private readonly createEmailTemplateUC: UseCase<CreateEmailTemplateInputDto,EmailTemplate>,
  ) {}

  createEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.createEmailTemplateUC.execute(req.body);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_TEMPLATE_CREATED_SUCCESSFULLY,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
