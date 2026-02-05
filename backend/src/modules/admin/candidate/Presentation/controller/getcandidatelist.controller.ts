import { Request, Response, NextFunction } from "express";
import { GetCandidateUseCase } from "../../Application/use-Cases/get-candidates.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";


export class GetCandidateAdminController {
  constructor(
    private readonly getCandidatesUC: GetCandidateUseCase
  ) {}

  getCandidates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let status: boolean | undefined;

      if (req.query.status === "true") {
        status = true;
      } else if (req.query.status === "false") {
        status = false;
      } else {
        status = undefined; // not provided → all
      }

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
