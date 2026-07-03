import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserStatusRequestDTO } from "../../../Application/dto/recruiter.dto/user.status.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class UnblockUserController {
  constructor(
    private readonly _unblockUserUC: IUseCase<UserStatusRequestDTO, void>,
  ) {}

  unblockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      if (!userId || typeof userId !== "string") {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      await this._unblockUserUC.execute({ userId });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.USER_UNBLOCKED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  };
}
