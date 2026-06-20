import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  RecruiterProfileOutput,
  RecruiterProfileRequestDTO,
} from "../../../Application/dto/recruiter.dto/recruiter-profile.output";

export class GetRecruiterProfileController {
  constructor(
    private readonly getRecruiterProfileUC: UseCase<
      RecruiterProfileRequestDTO,
      RecruiterProfileOutput
    >,
  ) {}

  getRecruiterProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { recruiterId } = req.params;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const recruiter = await this.getRecruiterProfileUC.execute({
        recruiterId,
      });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RECRUITER_PROFILE_LOADED_SUCCESSFULLY,
        data: recruiter,
      });
    } catch (err) {
      return next(err);
    }
  };
}
