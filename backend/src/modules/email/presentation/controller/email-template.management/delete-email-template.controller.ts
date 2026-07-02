import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { DeleteEmailTemplateRequestDTO } from "../../../application/dto/email.template/deleteEmailTemplateDTO";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class DeleteEmailTemplateController {
  constructor(
    private readonly DeleteTemplateUC: IUseCase<
      DeleteEmailTemplateRequestDTO,
      void
    >,
  ) {}

  deleteEmailTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      if (!id) {
        ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.EMAIL_IS_REQUIRED,
        );
      }
      await this.DeleteTemplateUC.execute({ id });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.TEMPLATE_DELETED_SUCCESSFULLY,
      );
    } catch (err) {
      return next(err);
    }
  };
}
