import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { DeleteEmailTemplateRequestDTO } from "../../../application/dto/email.template/deleteEmailTemplateDTO";

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
      await this.DeleteTemplateUC.execute({ id });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TEMPLATE_DELETED_SUCCESSFULLY,
      });
    } catch (err) {
      return next(err);
    }
  };
}
