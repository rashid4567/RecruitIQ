import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpdateEmailTemplateRequestDTO } from "../../../application/dto/email.template/updateEmailTemplate.input.dto";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { UpdateEmailTemplateSchema } from "../../validation/UpdateEmailTemplateSchema"; 

export class UpdateEmailTemplateController {
  constructor(
    private readonly updateTemplateUC: IUseCase<
      UpdateEmailTemplateRequestDTO,
      EmailTemplate
    >,
  ) {}

  updateEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.INVALID_ID,
        });
      }

      const body = UpdateEmailTemplateSchema.parse(req.body);
      const result = await this.updateTemplateUC.execute({
        id,
        input: body,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TEMPLATE_UPDATED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
