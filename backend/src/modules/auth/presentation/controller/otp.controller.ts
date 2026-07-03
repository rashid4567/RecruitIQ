import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { SendOtpSchema } from "../validators/send-otp.schema";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { SendRegistrationOTPRequest } from "../../application/dto/sendRegistration.otp.DTO";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class OtpController {
  constructor(
    private readonly _sendOtpUC: IUseCase<SendRegistrationOTPRequest, void>,
  ) {}

  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = SendOtpSchema.parse(req.body);
      await this._sendOtpUC.execute({ email, role });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.OTP_SENT_SUCCESSFULLY,
      );
    } catch (err) {
      console.log("error", err);
      next(err);
    }
  };
}
