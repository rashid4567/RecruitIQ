import { Request, Response, NextFunction } from "express";
import { LoginUseCase } from "../../application/useCase/auth/login.useCase";
import { LoginSchema } from "../validators/login.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import {
  setRefreshCookie,
  clearRefreshCookie,
} from "../utils/cookie.util";

export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
  ) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      const result = await this.loginUC.execute(
        email,
        password,
      );

      setRefreshCookie(res, result.refreshToken);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Login successfully",
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

  logout = (_req: Request, res: Response) => {
    clearRefreshCookie(res);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logout successfully",
    });
  };
}