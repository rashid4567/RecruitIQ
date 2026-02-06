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
      console.log(`body : `, req.params)
      console.log("PARAM userId:", req.params.userId);
      if(!userId){
        console.log("no userID is found")
      }


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
      console.error("err", error)
      next(error);
    }
  };
}
