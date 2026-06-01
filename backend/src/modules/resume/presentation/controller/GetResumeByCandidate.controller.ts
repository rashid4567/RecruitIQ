import { Request, Response, NextFunction } from "express";
import { GetResumeByCandidateUseCase } from "../../application/usecase/GetResumeByCandidateUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class GetResumeByCandidateController {
    constructor(
        private readonly getResumeByCandidateUC : GetResumeByCandidateUseCase
    ){};

    handle = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const candidateId = req.user?.userId;

            if(!candidateId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Unauthorized"
                })
            }

            const resume = await this.getResumeByCandidateUC.execute({
                candidateId : candidateId
            })

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Resume loaded succesfully",
                data : resume,
            })
        }catch(err){
            next(err);
        }
    }
}