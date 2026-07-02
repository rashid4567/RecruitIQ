import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { SendTestEmailInputDto } from "../../../application/dto/email.template/sent-test.email.input";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class SendTestEmailController {
  constructor(
    private readonly sendTestEmailUC: IUseCase<SendTestEmailInputDto, void>,
  ) {}
  sendTestEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.EMAIL_IS_REQUIRED,
        )
      }
      await this.sendTestEmailUC.execute({
        templateId: req.params.id,
        to: email,
      });

      ApiResponse.success(
        res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.TEST_EMAIL_SENT_SUCCESSFULLY,
      )
    } catch (err) {
      return next(err);
    }
  };
}
