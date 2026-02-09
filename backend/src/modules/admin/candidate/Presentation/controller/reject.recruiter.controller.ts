import { Request, Response ,NextFunction } from "express";
import { RejectRecruiterUseCase } from "../../Application/use-Cases/reject-recruiter.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class RejectRecruiterController{
    constructor(
        private readonly rejectRecruiterUC : RejectRecruiterUseCase
    ){};
    
    rejectRecruiter = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {recruiterId} = req.params;
            await this.rejectRecruiterUC.execute(recruiterId);
    
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Candidate rejected succesfully"
            })
        }catch(err){
  
            return next(err)
        }
    }
}