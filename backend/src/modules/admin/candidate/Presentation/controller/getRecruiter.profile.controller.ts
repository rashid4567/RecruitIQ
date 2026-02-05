import { Request, Response, NextFunction } from "express";
import { GetRecruiterProfileUseCase } from "../../Application/use-Cases/get-recruiter-profile.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetRecruiterProfileController{
    constructor(
        private readonly getRecruiterProfileUC : GetRecruiterProfileUseCase
    ){};

    getRecruiterProfile = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {recruiterId } = req.params;

            await this.getRecruiterProfileUC.execute(recruiterId);

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                messaeg : "Recruiter Profile loaded succesfully"
            })
        }catch(err){
            return next(err)
        }
    }
}