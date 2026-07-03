import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { GoogleLoginSchema } from "../validators/google-login.schema";
import { setRefreshCookie } from "../utils/cookie.util";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { GoogleLoginRequestDTO } from "../../application/dto/google-login.dto";
import { AuthResult } from "../../application/types/auth-result.type";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class GoogleController {
  constructor(
    private readonly _googleLoginUC: IUseCase<
      GoogleLoginRequestDTO,
      AuthResult
    >,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { credential, role } = GoogleLoginSchema.parse(req.body);
      const result = await this._googleLoginUC.execute({ credential, role });

      setRefreshCookie(res, result.refreshToken);
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.GOOGLE_LOGIN_SUCCESSFULLY,
        {
          accessToken: result.accessToken,
          user: {
            id: result.userId,
            role: result.role,
            fullName: result.fullName,
          },
        },
      );
    } catch (err) {
      return next(err);
    }
  };
}
