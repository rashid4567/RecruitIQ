import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateListRequestDTO,
  CandidateListResponseDTO,
} from "../../../Application/dto/candidate.dto/candidate-list-response.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class GetCandidateAdminController {
  constructor(
    private readonly _getCandidatesUC: IUseCase<
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

      const result = await this._getCandidatesUC.execute({
        page,
        limit,
        search: req.query.search as string | undefined,
        status,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CANDIDATES_LISTED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
