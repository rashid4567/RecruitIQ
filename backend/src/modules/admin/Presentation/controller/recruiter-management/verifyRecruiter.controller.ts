import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { VerifyRecruiterUseCase } from "../../../Application/use-Cases/recruiter-management/verify-recruiter.usecase";

export class VerifyRecruiterController{
    constructor(
        private readonly verifyRecruiterUC : VerifyRecruiterUseCase
    ){};

    verifyRecruiter = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {recruiterId} = req.params;
            await this.verifyRecruiterUC.execute(recruiterId);
          
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Recruiter verified succesfuuly"
            })
            
        }catch(err){
          
            return next(err);
        }
    }
}