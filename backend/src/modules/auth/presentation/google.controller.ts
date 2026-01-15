import { Request, Response, NextFunction } from "express";
import { GoogleLoginUseCase } from "../application/useCase/google-login.usecase";
import { HTTP_STATUS } from "../../../constants/httpStatus";

export class GoogleController{
    constructor(
        private readonly googleLoginUC : GoogleLoginUseCase
    ){};


    login = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {credential,role} = req.body;
            const result = await this.googleLoginUC.execute(credential,role);
            res.cookie("refreshToken",result.refreshToken,{httpOnly : true});
            res.status(HTTP_STATUS.OK).json({
                success : false,
                message : "Google login succesfully",
                data : result
            })
        }catch(err){
            return next(err)
        }
    }
}