import { ApplicationError } from "../../../../../shared/errors/application.error";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class VerifyRecruiterUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterRepository,
    private readonly createNotificationUC: CreateNotificationUseCase,
  ) {}

  async execute(recruiterId: string): Promise<void> {
    const recruiter =
      await this.recruiterRepo.findById(recruiterId);

    if (!recruiter) {
      throw new ApplicationError(
        ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND,
      );
    }

    if (!recruiter.canBeVerified()) {
      throw new ApplicationError(
        ERROR_CODES.RECRUITER_CANNOT_BE_VERIFIED,
      );
    }

    const updated = recruiter.verify();

    await this.recruiterRepo.verifyRecruiter(
      updated.getId(),
      "verified",
    );

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
      console.error(
        "RECRUITER_VERIFIED notification failed:",
        err,
      );
    }
  }
}