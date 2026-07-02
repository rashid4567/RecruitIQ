import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CreateEmailTemplateInputDto } from "../../../application/dto/email.template/createEmailTemplate.input.dto";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class CreateEmailTemplateController {
  constructor(
    private readonly createEmailTemplateUC: IUseCase<CreateEmailTemplateInputDto,EmailTemplate>,
  ) {}

  createEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.createEmailTemplateUC.execute(req.body);
      
      return ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.EMAIL_TEMPLATE_CREATED_SUCCESSFULLY,
      result,
      )
    } catch (error) {
      next(error);
    }
  };
}
