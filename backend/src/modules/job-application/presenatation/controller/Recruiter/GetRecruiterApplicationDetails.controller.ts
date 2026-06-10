import { Request, Response, NextFunction } from "express";
import { GetRecruiterApplicationDetailsUseCase } from "../../../application/usecase/recruiter/GetRecruiterApplicationDetailsUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetRecruiterApplicationDetailsController{
    constructor(
        private readonly getRecruiterApplicationUC : GetRecruiterApplicationDetailsUseCase
    ){};

    getApplicationDetails = async (req : Request, res : Response, next: NextFunction) =>{
        try{

            const recruiterId = req.user?.userId;

            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message: "Unauthorized"
                })
            }

            const {applicationId} = req.params;

            if(!applicationId){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "Application ID is Required",
                })
            }

            const application = await this.getRecruiterApplicationUC.execute(applicationId,recruiterId);

            return res.status(HTTP_STATUS.OK).json({
                success : false,
                message : "Applicaton Details fetched succesfully",
                data : application,
            })
        }catch(err){
            next(err);
        }
    }
}