import { Request, Response, NextFunction } from "express";
import { GetAllJobPostsUseCase } from "../../../Application/use-Cases/jobPost-mangment/getAll-JobPost.useCase";
import { JobStatus, JobType } from "../../../Domain/entities/jobPost-entity";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { SortField } from "../../../Domain/repositories/jobPost-repository";

export class GetAllJobPostController {
  constructor(private readonly getAllJobpostUC: GetAllJobPostsUseCase) {}
  jobList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      let isBlocked: boolean | undefined;
      if (req.query.isBlocked === "true") isBlocked = true;
      else if (req.query.isBlocked === "false") isBlocked = false;

      const result = await this.getAllJobpostUC.execute({
        page,
        limit,
        search: req.query.search as string | undefined,
        status: req.query.status as JobStatus | undefined,
        isBlocked,
        jobType: req.query.jobType as JobType | undefined,
        recruiterId: req.query.recruiterId as string | undefined,
        location: req.query.location as string | undefined,
        postedAfter: req.query.postedAfter
          ? new Date(req.query.postedAfter as string)
          : undefined,
        postedBefore: req.query.postedBefore
          ? new Date(req.query.postedBefore as string)
          : undefined,
        sortField: req.query.sortField as SortField | undefined,
        sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
        includeDeleted: req.query.includeDeleted === "true",
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Jobpost loaded succesfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
