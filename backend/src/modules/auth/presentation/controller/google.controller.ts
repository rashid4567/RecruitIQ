import { Request, Response, NextFunction } from "express";
import { GoogleLoginUseCase } from "../../application/useCase/google-login.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GoogleLoginSchema } from "../validators/google-login.schema";

export class GoogleController {
  constructor(private readonly googleLoginUC: GoogleLoginUseCase) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { credential, role } = GoogleLoginSchema.parse(req.body);
      console.log("the credential is : ",credential)
      console.log("the role is  :",role)
      const result = await this.googleLoginUC.execute(credential, role);

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
      return next(err);
    }
  };

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  }
}
