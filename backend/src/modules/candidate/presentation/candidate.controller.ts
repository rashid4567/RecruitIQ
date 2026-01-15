import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";

export class CandidateController{
     constructor(
        private readonly getProfileUC:{
            execute(userId: string) :Promise<any>
        },
        private readonly updateProfileUC:{
            execute(userId : string, data : any):Promise<any>
        },
        private readonly completeProfileUC :{
            execute(userId : string, data : any):Promise<any>
        },
        private readonly updatePasswordUC:{
            execute(userId : string,
                currentPassword: string,
        newPassword: string
            ):Promise<void>
        }
     ){};

     getProfile = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const profile = await this.getProfileUC.execute(req.user!.userId);
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "candidate profile loaded",
                data : profile,
            })
        }catch(err){
            return next(err)
        }
     }

     updateProfile = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const profile = await this.updateProfileUC.execute(req.user!.userId, req.body)
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "profile update succesfully",
                data : profile,
            })
        }catch(err){
            return next(err)
        }
     }

     completeProfile = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const profile = await this.completeProfileUC.execute(req.user!.userId,req.body);
            res.status(HTTP_STATUS.OK).json({
                success :true,
                message : "Profile completed succesfully",
                data : profile,
            })
        }catch(err){
            return next(err)
        }
     }

     updtePassword = async (req : Request, res : Response , next : NextFunction) =>{
        try{
            const {currentPassword, newPassword} = req.body;
            await this.updatePasswordUC.execute(
                req.user!.userId,
                currentPassword,
                newPassword,
            )

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Password updated succesfully",
            })
        }catch(err){
            return next(err)
        }
     }
}