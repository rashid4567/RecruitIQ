import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { VerifyRecruiterRequestDTO } from "../../dto/recruiter.dto/recruiter.status.dto";

export class VerifyRecruiterUseCase implements IUseCase<
  VerifyRecruiterRequestDTO,
  void
> {
  constructor(
    private readonly recruiterRepo: RecruiterRepository,
    private readonly createNotificationUC: CreateNotificationUseCase,
  ) {}

  async execute(request: VerifyRecruiterRequestDTO): Promise<void> {
    const recruiter = await this.recruiterRepo.findById(request.recruiterId);

    if (!recruiter) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND);
    }

    if (!recruiter.canBeVerified()) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_CANNOT_BE_VERIFIED);
    }

    const updated = recruiter.verify();

    await this.recruiterRepo.verifyRecruiter(updated.getId(), "verified");

    try {
      await this.createNotificationUC.execute({
        recipientId: updated.getId(),
        recipientRole: "recruiter",
        title: "Verification Approved",
        message:
          "Congratulations! Your recruiter account has been successfully verified.",
        type: NotificationType.RECRUITER_VERIFIED,
        actionUrl: "/recruiter/profile",
        referenceId: updated.getId(),
        metadata: {
          recruiterId: updated.getId(),
        },
      });
    } catch (err) {
      console.error("RECRUITER_VERIFIED notification failed:", err);
    }
  }
}
