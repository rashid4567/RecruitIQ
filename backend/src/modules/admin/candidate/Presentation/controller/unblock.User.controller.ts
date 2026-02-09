import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus"; 
import { UnblockUserUseCase } from "../../Application/use-Cases/unblock-user.usecase";

export class UnblockUserController {
  constructor(
    private readonly unblockUserUC: UnblockUserUseCase
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
          message : "Invalid userId in route params"
        })
      }
      await this.unblockUserUC.execute(userId);
      
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "User unblocked successfully",
      });
    } catch (error) {

      next(error);
    }
  };
}
