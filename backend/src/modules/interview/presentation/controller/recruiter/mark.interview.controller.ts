import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  MarkRecruiterJoinedRequestDTO,
  MarkRecruiterJoinedResponseDTO,
} from "../../../application/dto/mark-recruiter-joined.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class MarkRecruiterJoinedController {
  constructor(
    private readonly _markRecruiterJoinedUC: IUseCase<
      MarkRecruiterJoinedRequestDTO,
      MarkRecruiterJoinedResponseDTO
    >,
  ) {}

  join = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
    

    const recruiterId = req.user?.userId;

    if(!recruiterId){
        ApiResponse.error(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGE.UNAUTHORIZED,
        )
    }

    const {interviewId} = req.params;
    if(!interviewId){
         ApiResponse.error(
            res,
            HTTP_STATUS.BAD_REQUEST,
            ERROR_MESSAGE.INTERVIEW_REQUIRED,
        )
    }

      const result = await this._markRecruiterJoinedUC.execute({
        interviewId,
        recruiterId : recruiterId!,
      });

       ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RECRUITER_JOINED_INTERVIEW_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}