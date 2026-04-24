import { Request, Response, NextFunction } from "express";
import { GetAllJobPostsUseCase } from "../../../application/use-cases/jobPost/getAllJobPost.useCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { GetAllJobPostsRequestDTO } from "../../../application/dto/jobPost.dto";

export class GetAllJobPostsController {
  constructor(
    private readonly getAllJobPostUC: GetAllJobPostsUseCase
  ) {}

  getAllJobPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto: GetAllJobPostsRequestDTO = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,

        search: req.query.search as string | undefined,
        jobType: req.query.jobType as string | undefined,

        isRemote:
          req.query.isRemote !== undefined
            ? req.query.isRemote === "true"
            : undefined,

        skills: req.query.skills
          ? (req.query.skills as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,

        experienceMin: req.query.experienceMin
          ? Number(req.query.experienceMin)
          : undefined,

        experienceMax: req.query.experienceMax
          ? Number(req.query.experienceMax)
          : undefined,

        department: req.query.department as string | undefined,
      };

      const result = await this.getAllJobPostUC.execute(dto);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job posts loaded successfully",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };
}