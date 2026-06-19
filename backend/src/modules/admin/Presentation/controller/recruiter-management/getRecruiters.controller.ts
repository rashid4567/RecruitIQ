import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { VerificationStatus } from "../../../Domain/entities/recruiter.entity";
import { GetRecruitersUseCase } from "../../../Application/use-Cases/recruiter-management/get-recruiters.usecase";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetRecruitersQuery,
  GetRecruitersResponseDTO,
} from "../../../Application/dto/recruiter.dto/get-recruiters.query";

export class GetRecruitersController {
  constructor(
    private readonly getRecruitersUC: UseCase<
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

      const result = await this.getRecruitersUC.execute({
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

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RECRUITERS_LOADED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
