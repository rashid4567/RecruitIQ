import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ToggleEmailTemplateRequestDTO } from "../../../application/dto/email.template/toggleEmail.template.input.dto";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

export class ToggleEmailTemplateController {
  constructor(
    private readonly toggleTemplateUC: IUseCase<
      ToggleEmailTemplateRequestDTO,
      EmailTemplate
    >,
  ) {}

  toggleEmailTemplate = async (
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
        );
      }
      const result = await this.toggleTemplateUC.execute({ id });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.EMAIL_TEMPLATE_STATUS_UPDATED,
        result,
      );
    } catch (err) {
      return next(err);
    }
  };
}
