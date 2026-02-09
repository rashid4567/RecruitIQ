import { Request, Response, NextFunction } from "express";
import { GetCandidateprofileUseCase } from "../../Application/use-Cases/get-candidate-profile.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { logger } from "../../../../../shared/logger/logger";

export class GetCandidateProfileController {
    constructor(
        private readonly getCandidteProfileUC : GetCandidateprofileUseCase
    ){};

    getCandidateProfile = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {candidateId} = req.params;
            
            const profile = await this.getCandidteProfileUC.execute(candidateId)
            
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Candidate profile loaded succesfully",
                data :profile,
            })
        }catch(err){
           logger.error(err);
            return next(err)
        }
    }
}