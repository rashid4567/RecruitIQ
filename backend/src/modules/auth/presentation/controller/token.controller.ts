import { Request, Response, NextFunction } from "express";
import { RefreshSchema } from "../validators/refresh.schema";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  RefershTokenResponseDTO,
  RefreshTokenRequestDTO,
} from "../../application/dto/refresh.TokenDTO";
import { ApiResponse } from "../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";

export class TokenController {
  constructor(
    private readonly _refreshUC: IUseCase<
      RefreshTokenRequestDTO,
      RefershTokenResponseDTO
    >,
  ) {}

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = RefreshSchema.safeParse({
        refreshToken: req.cookies?.refreshToken,
      });

      if (!parsed.success) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.NO_REFRESH_TOKEN,
        );
      }
      const result = await this._refreshUC.execute({
        refreshToken: parsed.data.refreshToken,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
