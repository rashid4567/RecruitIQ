import { Request, Response, NextFunction } from "express";
import { BlockUserUseCase } from "../../../Application/use-Cases/user-management/block-user.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserStatusRequestDTO } from "../../../Application/dto/recruiter.dto/user.status.dto";

export class BlockUserController {
  constructor(
    private readonly blockUserUC: UseCase<UserStatusRequestDTO, void>,
  ) {}

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      if (!userId || typeof userId !== "string") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.INVALID_USERID_IN_ROUTE_PARAMS,
        });
      }
      await this.blockUserUC.execute({ userId });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_BLOCKED_SUCCESSFULLY,
      });
    } catch (err) {
      return next(err);
    }
  };
}
