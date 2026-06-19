import { Request, Response, NextFunction } from "express";
import { LoginSchema } from "../validators/login.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { USER_ROLES } from "../../domain/constants/roles.constants";
import { setRefreshCookie } from "../utils/cookie.util";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  LoginRequestDTO,
  LoginResponseDTO,
} from "../../application/dto/login.dto";

export class AdminAuthController {
  constructor(
    private readonly adminLoginUC: UseCase<LoginRequestDTO, LoginResponseDTO>,
  ) {}
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const result = await this.adminLoginUC.execute({ email, password });
      if (result.role !== USER_ROLES.ADMIN) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGE.ACCESS_DENIED,
        });
      }

      setRefreshCookie(res, result.refreshToken);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADMIN_LOGIN_SUCCESFULLY,
        data: {
          accessToken: result.accessToken,
          user: {
            id: result.userId,
            role: result.role,
          },
        },
      });
    } catch (err) {
      console.log("error", err);
      next(err);
    }
  };
}
