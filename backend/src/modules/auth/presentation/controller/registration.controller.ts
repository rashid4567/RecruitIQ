import { Request, Response, NextFunction } from "express";
import { VerifyRegistrationUseCase } from "../../application/useCase/registration/verify-registration.usecase";
import { RegisterSchema } from "../validators/register.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { setRefreshCookie } from "../utils/cookie.util";

export class RegistrationController {
  constructor(
    private readonly verifyRegistrationUC: VerifyRegistrationUseCase,
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = RegisterSchema.parse(req.body);

      const result =
        await this.verifyRegistrationUC.execute(dto);

      setRefreshCookie(res, result.refreshToken);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (err) {
      console.log("error", err);
      next(err);
    }
  };
}