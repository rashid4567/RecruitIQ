import { Request, Response, NextFunction } from "express";
import { GetCandidateUseCase } from "../../Application/use-Cases/get-candidates.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

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

    console.log("status : ", status)

      const result = await this.getCandidatesUC.execute({
        page,
        limit,
        search: req.query.search as string | undefined,
        status,
      });

      console.log("result", result)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Candidates listed successfully",
        data: result,
      });
    } catch (err) {
      console.log("err", err);
      next(err);
    }
  };
}
