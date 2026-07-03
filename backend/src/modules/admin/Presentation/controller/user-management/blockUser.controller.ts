import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserStatusRequestDTO } from "../../../Application/dto/recruiter.dto/user.status.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class BlockUserController {
  constructor(
    private readonly _blockUserUC: IUseCase<UserStatusRequestDTO, void>,
  ) {}

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      if (!userId || typeof userId !== "string") {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        )
      }
      await this._blockUserUC.execute({ userId });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.USER_BLOCKED_SUCCESSFULLY
      )
    } catch (err) {
      return next(err);
    }
  };
}
