import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EndInterviewRequestDTO, EndInterviewResponseDTO } from "../../../application/dto/complete-interview.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { CompleteInterviewSchema } from "../../validation/complente.interview.schema";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class EndInterviewController{
    constructor(private readonly endInterviewUC : IUseCase<EndInterviewRequestDTO,EndInterviewResponseDTO>){};

    end = async (req : Request , res : Response, next : NextFunction) =>{
        try{
            const recruiterId = req.user?.userId;
            if(!recruiterId){
                return ApiResponse.error(
                    res,
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_MESSAGE.UNAUTHORIZED
                )
            }

            const {interviewId} = req.params;

            if(!interviewId){
                return ApiResponse.error(
                    res,
                    HTTP_STATUS.BAD_REQUEST,
                    ERROR_MESSAGE.INTERVIEW_REQUIRED
                )
            }

            const validateData = CompleteInterviewSchema.parse(req.body);
            const result = await this.endInterviewUC.execute({
                interviewId,
                recruiterId,
                notes : validateData.notes
            })

            return ApiResponse.success(
                res,
                HTTP_STATUS.OK,
                SUCCESS_MESSAGES.INTERVIEW_COMPLETED_SUCCESSFULLY,
            )
        }catch(err){
            next(err)
        }
    }
}