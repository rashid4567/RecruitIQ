import { Request, Response, NextFunction } from "express";
import { LoginUseCase } from "../../application/useCase/login.useCase";
import { LoginSchema } from "../validators/login.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const result = await this.loginUC.execute(email, password);

      this.setRefreshCookie(res, result.refreshToken);

      res.status(HTTP_STATUS.OK).json({
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
      next(err);
    }
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logout successfully",
    });
  };

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
