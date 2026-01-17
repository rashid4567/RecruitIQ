import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GetRecruitersUseCase } from "../Application/use-Cases/get-recruiters.usecase";
import { GetRecruiterProfileUseCase } from "../Application/use-Cases/get-recruiter-profile.usecase";
import { VerifyRecruiterUseCase } from "../Application/use-Cases/verify-recruiter.usecase";
import { UnblockRecruiterUseCase } from "../Application/use-Cases/unblock-recruiter.usecase";
import { BlockRecruiterUseCase } from "../Application/use-Cases/block-recruiter.usecase";

export class RecruiterAdminController{
    constructor(
        private readonly getRecruitersUC : GetRecruitersUseCase,
        private readonly getProfileUC : GetRecruiterProfileUseCase,
        private readonly verifyUC : VerifyRecruiterUseCase,
        private readonly blockUC  : BlockRecruiterUseCase,
        private readonly unblockUC : UnblockRecruiterUseCase
    ){};

    getRecruiter = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const result = await this.getRecruitersUC.execute(req.query);
            return res.status(HTTP_STATUS.OK).json({
                success :true,
                message :  "Recruiter load succesfully",
                data : result
            })
        }catch(err){
            return next(err)
        }
    }

    getRecruiterProfile = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const profile = await this.getProfileUC.execute(req.params.recruiterId)
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Candidate profile loaded",
                data : profile
            })
        }catch(err){
            return next(err)
        }
    }

    verifyRecruiter = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {status} = req.body;
             const verified = await this.verifyUC.execute(req.params.recruiterId, status);
             return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Recruiter verification status updated succesfully",
               data : verified, 
             })
        }catch(err){
            return next(err)
        }
    }

    blockRecruiter = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            await this.blockUC.execute(req.params.recruiterId)
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Recruiter blocked succesfully",
            })
        }catch(err){
            return next(err)
        }
    }

    unblockRecruiter = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            await this.unblockUC.execute(req.params.recruiterId)
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Recruiter unblocked succesfully"
            })
        }catch(err){
            return next(err)
        }
    }
}