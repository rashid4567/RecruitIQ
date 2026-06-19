import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { SendOtpSchema } from "../validators/send-otp.schema";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { SendRegistrationOTPRequest } from "../../application/dto/sendRegistration.otp.DTO";

export class OtpController {
  constructor(
    private readonly sendOtpUC: UseCase<SendRegistrationOTPRequest, void>,
  ) {}

  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = SendOtpSchema.parse(req.body);
      console.log("otp : ", req.body);
      await this.sendOtpUC.execute({email, role});
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.OTP_SENT_SUCCESSFULLY,
      });
    } catch (err) {
      console.log("error", err);
      next(err);
    }
  };
}
