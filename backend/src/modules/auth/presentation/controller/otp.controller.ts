import { Request, Response, NextFunction } from "express";
import { SendRegistrationOTPUseCase } from "../../application/useCase/send-registration-otp.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { SendOtpSchema } from "../validators/send-otp.schema";
import { logger } from "../../../../shared/logger/logger";

export class OtpController {
  constructor(
    private readonly sendOtpUC: SendRegistrationOTPUseCase,
  ) {}

  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = SendOtpSchema.parse(req.body);
      await this.sendOtpUC.execute(email, role);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
