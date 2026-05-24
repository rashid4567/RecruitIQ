import { Request, Response, NextFunction } from "express";
import { GetJobByIdUseCase } from "../../../application/usecase/job/get-jobpost-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class CandidateJobByIdController {
  constructor(private readonly getUc: GetJobByIdUseCase) {}
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.id;

      console.log("jobId:", jobId);

      const job = await this.getUc.execute(jobId);

      console.log("job loaded:", job);

      console.log("visible:", job.isVisibleToCandidate());

      const candidateData = job.candidateView();

      console.log("candidate data:", candidateData);

      return res.json({
        success: true,
        data: candidateData,
      });
    } catch (err) {
      console.log("ERROR:", err);

      next(err);
    }
  };
}
