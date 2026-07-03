import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpdateEmailTemplateRequestDTO } from "../../../application/dto/email.template/updateEmailTemplate.input.dto";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { UpdateEmailTemplateSchema } from "../../validation/UpdateEmailTemplateSchema"; 
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class UpdateEmailTemplateController {
  constructor(
    private readonly _updateTemplateUC: IUseCase<
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
       return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.EMAIL_IS_REQUIRED,
        )
      }

      const body = UpdateEmailTemplateSchema.parse(req.body);
      const result = await this._updateTemplateUC.execute({
        id,
        input: body,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.TEMPLATE_UPDATED_SUCCESSFULLY,
        result,
      )
    } catch (err) {
      next(err);
    }
  };
}
