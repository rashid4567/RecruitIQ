import { Request, Response, NextFunction } from "express";
import { VerifyRegistrationUseCase } from "../../application/useCase/verify-registration.usecase";
import { RegisterSchema } from "../validators/register.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class RegistrationController {
  constructor(
    private readonly verifyRegistrationUC: VerifyRegistrationUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = RegisterSchema.parse(req.body);
      const result = await this.verifyRegistrationUC.execute(dto);

      this.setRefreshCookie(res, result.refreshToken);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: result,
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
    });
  }
}
