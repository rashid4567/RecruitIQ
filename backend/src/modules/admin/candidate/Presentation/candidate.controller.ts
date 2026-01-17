import { Request, Response, NextFunction } from "express";
import { GetCandidateProfileUseCase } from "../../../candidate/application/use-cases/get-candidate-profile.usecase";
import { BlockCandidateUseCase } from "../Application/use-Cases/block-candidate.usecase";
import { GetCandidateprofileUseCase } from "../Application/use-Cases/get-candidate-profile.usecase";
import { GetcandidateUseCase } from "../Application/use-Cases/get-candidates.usecase";
import { UnblockCandidteUseCase } from "../Application/use-Cases/unblock-candidate.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class CandidateAdminContoller {
  constructor(
    private readonly getCandidateUC: GetcandidateUseCase,
    private readonly CandidateprofileUC: GetCandidateprofileUseCase,
    private readonly blockUC: BlockCandidateUseCase,
    private readonly unBlockUC: UnblockCandidteUseCase
  ) {}

  getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getCandidateUC.execute({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string,
        status:
          req.query.status === "Active" || req.query.status === "Blocked"
            ? req.query.status
            : "All",
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        messasge: "candidate listed succesfully",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  };
  getCandidateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { candidateId } = req.params;
    console.log("PARAMS:", req.params);
console.log("the candidate id is ", candidateId)
    const profile = await this.CandidateprofileUC.execute(candidateId);
    console.log("the profile is :",profile)
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Candidate profile loaded successfully",
      data: profile,
    });
  } catch (err) {
    return next(err);
  }
};

  blockCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { candidateId } = req.params;
      await this.blockUC.execute(candidateId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Candidate blocked succesfully",
      });
    } catch (err) {
      return next(err);
    }
  };
  unblockCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { candidateId } = req.params;
      await this.unBlockUC.execute(candidateId);
      res.status(HTTP_STATUS.OK).json({
        success : true,
        message : "Candidate unblocked succesfully",
      })
    } catch (err) {
      return next(err);
    }
  };
}
