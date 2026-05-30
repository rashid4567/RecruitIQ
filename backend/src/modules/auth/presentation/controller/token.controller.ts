import { Request, Response, NextFunction } from "express";
import { RefreshTokenUseCase } from "../../application/useCase/token/refreshToken.useCase";
import { RefreshSchema } from "../validators/refresh.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
export class TokenController {
  constructor(private readonly refreshUC: RefreshTokenUseCase) {}

 refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("REFRESH HIT");
    console.log("COOKIES:", req.cookies);
    console.log(
      "REFRESH TOKEN:",
      req.cookies?.refreshToken,
    );

    const parsed = RefreshSchema.safeParse({
      refreshToken: req.cookies?.refreshToken,
    });

    if (!parsed.success) {
      console.log("NO REFRESH TOKEN FOUND");

      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const result = await this.refreshUC.execute(
      parsed.data.refreshToken,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    next(err);
  }
};
}
