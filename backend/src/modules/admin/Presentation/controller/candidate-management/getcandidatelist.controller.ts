import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateListRequestDTO,
  CandidateListResponseDTO,
} from "../../../Application/dto/candidate.dto/candidate-list-response.dto";

export class GetCandidateAdminController {
  constructor(
    private readonly getCandidatesUC: UseCase<
      CandidateListRequestDTO,
      CandidateListResponseDTO
    >,
  ) {}

  getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const status =
        req.query.status === "true"
          ? true
          : req.query.status === "false"
            ? false
            : undefined;

      const result = await this.getCandidatesUC.execute({
        page,
        limit,
        search: req.query.search as string | undefined,
        status,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANDIDATES_LISTED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
