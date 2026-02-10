import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { GetCandidateUseCase } from "../../../Application/use-Cases/candidate-management/get-candidates.usecase";

export class GetCandidateAdminController {
  constructor(private readonly getCandidatesUC: GetCandidateUseCase) {}

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
        message: "Candidates listed successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
