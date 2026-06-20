import { Request, Response, NextFunction } from "express";
import { SendTestEmailUseCase } from "../../../application/usecase/email-template/send-test-email.usecase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { SendTestEmailInputDto } from "../../../application/dto/email.template/sent-test.email.input";

export class SendTestEmailController {
  constructor(
    private readonly sendTestEmailUC: UseCase<SendTestEmailInputDto, void>,
  ) {}
  sendTestEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.EMAIL_IS_REQUIRED,
        });
      }
      await this.sendTestEmailUC.execute({
        templateId: req.params.id,
        to: email,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TEST_EMAIL_SENT_SUCCESSFULLY,
      });
    } catch (err) {
      return next(err);
    }
  };
}
