import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { RecruiterProfileRepository } from "../../../domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { UpdateRecruiterSubscriptionStatusRequestDTO } from "../../dto/updateRecruiterSubscriptionStatus.dto";

export class UpdateRecruiterSubscriptionStatusUseCase implements UseCase<
  UpdateRecruiterSubscriptionStatusRequestDTO,
  void
> {
  constructor(
    private readonly recruiterProfileRepo: RecruiterProfileRepository,
  ) {}
  async execute(
    request: UpdateRecruiterSubscriptionStatusRequestDTO,
  ): Promise<void> {
    const profile = await this.recruiterProfileRepo.findByUserId(
      UserId.create(request.recruiterId),
    );
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_NOT_FOUND);
    }
    profile.updateSubscriptionStatus(request.status);
    await this.recruiterProfileRepo.save(profile);
  }
}
