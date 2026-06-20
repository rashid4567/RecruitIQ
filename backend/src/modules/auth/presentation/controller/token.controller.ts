import { Request, Response, NextFunction } from "express";
import { RefreshSchema } from "../validators/refresh.schema";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  RefershTokenResponseDTO,
  RefreshTokenRequestDTO,
} from "../../application/dto/refresh.TokenDTO";

export class TokenController {
  constructor(
    private readonly refreshUC: UseCase<
      RefreshTokenRequestDTO,
      RefershTokenResponseDTO
    >,
  ) {}

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("REFRESH HIT");
      console.log("COOKIES:", req.cookies);
      console.log("REFRESH TOKEN:", req.cookies?.refreshToken);

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
      const result = await this.refreshUC.execute({
        refreshToken: parsed.data.refreshToken,
      });

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
