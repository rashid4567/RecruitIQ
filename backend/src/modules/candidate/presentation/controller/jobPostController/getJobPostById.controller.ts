import { Request, Response, NextFunction } from "express";
import { GetJobPostByIdUseCase } from "../../../application/use-cases/jobPost/getJobPostById.useCase";
import { GetJobPostByIdRequestDTO } from "../../../application/dto/jobPost.dto";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetJobPostByIdController {
  constructor(
    private readonly getJobPostByIdUC: GetJobPostByIdUseCase
  ) {}

  getJobPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;

    
      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Job post ID is required",
        });
      }

      const dto: GetJobPostByIdRequestDTO = { id };

      const result = await this.getJobPostByIdUC.execute(dto);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job post loaded successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}