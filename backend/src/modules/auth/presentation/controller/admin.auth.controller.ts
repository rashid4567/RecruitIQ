import { Request, Response, NextFunction } from "express";
import { AdminLoginUseCase } from "../../application/useCase/admin-login.usecase";
import { LoginSchema } from "../validators/login.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { USER_ROLES } from "../../domain/constants/roles.constants"; 
export class AdminAuthController {
  constructor(
    private readonly adminLoginUC: AdminLoginUseCase,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const result = await this.adminLoginUC.execute(email, password);

      if(result.role !== USER_ROLES.ADMIN){
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success : false,
            message : "Access denied"
        })
      }

      this.setRefreshCookie(res, result.refreshToken);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Admin login successfully",
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

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge : 7 * 24 * 60 * 1000,
    });
  }
}
