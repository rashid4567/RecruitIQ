import { Request, Response, NextFunction } from "express";
import { GoogleLoginUseCase } from "../../application/useCase/google-login.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GoogleLoginSchema } from "../validators/google-login.schema";

export class GoogleController {
  constructor(private readonly googleLoginUC: GoogleLoginUseCase) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { credential, role } = GoogleLoginSchema.parse(req.body);
      const result = await this.googleLoginUC.execute(credential, role);
      console.log("role and credential : ", role , credential);
      console.log("result : ", result)
      this.setRefreshCookie(res, result.refreshToken);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Google login successfully",
        data: {
          accessToken: result.accessToken,
          userId: result.userId,
          role: result.role,
        },
      });
    } catch (err) {
      console.log(err)
      return next(err);

    }
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
