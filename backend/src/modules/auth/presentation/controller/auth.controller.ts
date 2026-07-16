import { Request, Response, NextFunction } from "express";
import { LoginSchema } from "../validators/login.schema";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { setRefreshCookie, clearRefreshCookie } from "../utils/cookie.util";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  LoginRequestDTO,
  LoginResponseDTO,
} from "../../application/dto/login.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class AuthController {
  constructor(
    private readonly _loginUC: IUseCase<LoginRequestDTO, LoginResponseDTO>,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const result = await this._loginUC.execute({
        email,
        password,
      });

      setRefreshCookie(res, result.refreshToken);
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.LOGIN_SUCCESSFULLY,
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          profileCompleted: result.profileCompleted,
          isFirstLogin: result.isFirstLogin,
          user: {
            id: result.user.id,
            role: result.user.role,
            fullName: result.user.fullName,
            profileImage: result.user.profileImage,
          },
        },
      );
    } catch (err) {
      next(err);
    }
  };

  logout = (_req: Request, res: Response) => {
    clearRefreshCookie(res);

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.LOGOUT_SUCCESSFULLY,
    );
  };
}
