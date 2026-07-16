import { Request, Response, NextFunction } from "express";
import { LoginSchema } from "../validators/login.schema";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { USER_ROLES } from "../../domain/constants/roles.constants";
import { setRefreshCookie } from "../utils/cookie.util";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  LoginRequestDTO,
  LoginResponseDTO,
} from "../../application/dto/login.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class AdminAuthController {
  constructor(
    private readonly _adminLoginUC: IUseCase<LoginRequestDTO, LoginResponseDTO>,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const result = await this._adminLoginUC.execute({
        email,
        password,
      });

      if (result.user.role !== USER_ROLES.ADMIN) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.FORBIDDEN,
          ERROR_MESSAGE.ACCESS_DENIED,
        );
      }

      setRefreshCookie(res, result.refreshToken);

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.ADMIN_LOGIN_SUCCESFULLY,
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
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
}
