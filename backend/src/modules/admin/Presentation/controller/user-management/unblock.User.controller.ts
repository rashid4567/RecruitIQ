import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus"; 
import { UnblockUserUseCase } from "../../../Application/use-Cases/user-management/unblock-user.usecase";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserStatusRequestDTO } from "../../../Application/dto/recruiter.dto/user.status.dto";

export class UnblockUserController {
  constructor(
    private readonly unblockUserUC: UseCase<UserStatusRequestDTO, void>
  ) {}

  unblockUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;


      if(!userId || typeof userId !== "string"){
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success : false,
          message : ERROR_MESSAGE.INVALID_USERID_IN_ROUTE_PARAMS
        }) 
      }
      await this.unblockUserUC.execute({userId});
      
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.USER_UNBLOCKED_SUCCESSFULLY,
      });
    } catch (error) {

      next(error);
    }
  };
}
