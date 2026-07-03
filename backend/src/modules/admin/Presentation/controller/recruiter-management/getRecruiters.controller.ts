import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { VerificationStatus } from "../../../Domain/entities/recruiter.entity";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetRecruitersQuery,
  GetRecruitersResponseDTO,
} from "../../../Application/dto/recruiter.dto/get-recruiters.query";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class GetRecruitersController {
  constructor(
    private readonly _getRecruitersUC: IUseCase<
      GetRecruitersQuery,
      GetRecruitersResponseDTO
    >,
  ) {}

  recruiterList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      let isActive: boolean | undefined;
      if (req.query.isActive === "true") isActive = true;
      else if (req.query.isActive === "false") isActive = false;

      const result = await this._getRecruitersUC.execute({
        page,
        limit,
        search: req.query.search as string | undefined,
        verificationStatus: req.query.verificationStatus as
          | VerificationStatus
          | undefined,
        subscriptionStatus: req.query.subscriptionStatus as string | undefined,
        isActive,
        sort: req.query.sort as "latest" | "oldest" | undefined,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RECRUITERS_LOADED_SUCCESSFULLY,
        result,
      )
    } catch (err) {
      next(err);
    }
  };
}
