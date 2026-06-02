import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { subscriptionStatus } from "../../../domain/constatns/subscriptionStatus.constants";
import { RecruiterProfileRepository } from "../../../domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export class UpdateRecruiterSubscriptionStatusUseCase {
  constructor(
    private readonly recruiterProfileRepo: RecruiterProfileRepository,
  ) {}
  async execute(
    recruiterId: string,
    status: subscriptionStatus,
  ): Promise<void> {
    const profile = await this.recruiterProfileRepo.findByUserId(
      UserId.create(recruiterId),
    );
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }
    profile.updateSubscriptionStatus(status);
    await this.recruiterProfileRepo.save(profile);
  }
}
