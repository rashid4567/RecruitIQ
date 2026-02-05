import { Request, Response, NextFunction } from "express";
import { BlockUserUseCase } from "../../Application/use-Cases/block-user.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class BlockUserController{
    constructor(
        private readonly blockUserUC : BlockUserUseCase
    ){};

    blockUser = async (req : Request, res : Response , next : NextFunction) =>{
        try{
            const {userId} = req.params;

        await this.blockUserUC.execute(userId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message : "User blocked succesfully",
        })
        }catch(err){
            return next(err)
        }
    }
  }
