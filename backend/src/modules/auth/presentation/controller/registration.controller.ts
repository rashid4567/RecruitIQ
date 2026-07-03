import { Request, Response, NextFunction } from "express";
import { RegisterSchema } from "../validators/register.schema";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { setRefreshCookie } from "../utils/cookie.util";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { VerificationInput, VerifyRegistrationResponseDTO } from "../../application/dto/verification.input.dto";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class RegistrationController {
  constructor(
    private readonly _verifyRegistrationUC:  IUseCase<
      VerificationInput,
      VerifyRegistrationResponseDTO
    > ,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = RegisterSchema.parse(req.body);
      const result = await this._verifyRegistrationUC.execute(dto);
      setRefreshCookie(res, result.refreshToken);
      ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.USER_REGISTERED_SUCCESSFULLY,
        result
      )
    } catch (err) {
      next(err);
    }
  };
}
