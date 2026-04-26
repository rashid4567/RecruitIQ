import { Request, Response, NextFunction } from "express";
import { RefreshTokenUseCase } from "../../application/useCase/refreshToken.useCase";
import { RefreshSchema } from "../validators/refresh.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
export class TokenController {
  constructor(
    private readonly refreshUC: RefreshTokenUseCase,
  ) {}

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = RefreshSchema.parse({
        refreshToken: req.cookies?.refreshToken,
      });


      const parsed = RefreshSchema.safeParse({
        refreshToken : req.cookies?.refreshToken,
      })

      if(!parsed.success){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success : false,
          message : "No refresh token provided",
        })
      }

      const result = await this.refreshUC.execute(refreshToken);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
