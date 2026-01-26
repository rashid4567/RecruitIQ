import {Request, Response, NextFunction } from "express";
import { updatePasswordUseCase } from "../../application/useCase/update-password.usecase";
import { changePasswordSchema } from "../validators/change-password.schema";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class ChangePasswordController{
    constructor(
        private readonly updatePasswordUC : updatePasswordUseCase
    ){};

    updatePassword = async(req : Request, res : Response , next : NextFunction) =>{
        try{
            const {currentPassword, newPassword} = changePasswordSchema.parse(req.body);

         

            await this.updatePasswordUC.execute(
                req.user!.userId,
                currentPassword,
                newPassword,
            )

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message : "Password update succesfully",
            })
        }catch(err){
            next(err)
        }
    }
    
}