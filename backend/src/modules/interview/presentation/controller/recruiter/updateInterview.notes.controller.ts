import { Request, Response, NextFunction } from "express";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import {
  UpdateInterviewNotesRequestDTO,
  UpdateInterviewNotesResponseDTO,
} from "../../../application/dto/update-interview-notes.dto";

import { UpdateInterviewNotesSchema } from "../../validation/complente.interview.schema";

export class UpdateInterviewNotesController {
  constructor(
    private readonly _updateInterviewNotesUseCase: IUseCase<
      UpdateInterviewNotesRequestDTO,
      UpdateInterviewNotesResponseDTO
    >,
  ) {}

  updateInterviewNotes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
   
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.UNAUTHORIZED,
        );
      }

      const { interviewId } = req.params;

      if (!interviewId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.INTERVIEW_NOT_FOUND,
        );
      }
      const validatedData = UpdateInterviewNotesSchema.parse(req.body ?? {});

      const result = await this._updateInterviewNotesUseCase.execute({
        interviewId,
        recruiterId,
        notes: validatedData.notes,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.INTERVIEW_NOTES_UPDATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
