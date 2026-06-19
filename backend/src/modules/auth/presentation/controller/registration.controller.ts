import { Request, Response, NextFunction } from "express";
import { RegisterSchema } from "../validators/register.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { setRefreshCookie } from "../utils/cookie.util";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { VerificationInput, VerifyRegistrationResponseDTO } from "../../application/dto/verification.input.dto";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";

export class RegistrationController {
  constructor(
    private readonly verifyRegistrationUC:  UseCase<
      VerificationInput,
      VerifyRegistrationResponseDTO
    > ,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = RegisterSchema.parse(req.body);

      const result = await this.verifyRegistrationUC.execute(dto);

      setRefreshCookie(res, result.refreshToken);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_REGISTERED_SUCCESSFULLY, 
        data: result,
      });
    } catch (err) {
      console.log("error", err);
      next(err);
    }
  };
}
