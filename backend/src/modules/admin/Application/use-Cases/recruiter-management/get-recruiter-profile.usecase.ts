import { ApplicationError } from "../../../../auth/application/errors/application.error";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";
import { Recruiter } from "../../../Domain/entities/recruiter.entity";

export class GetRecruiterProfileUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterRepository,
  ) {}

  async execute(recruiterId: string): Promise<Recruiter> {
    const recruiter = await this.recruiterRepo.findById(recruiterId);

    if (!recruiter) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND);
    }

    return recruiter;
  }
}
