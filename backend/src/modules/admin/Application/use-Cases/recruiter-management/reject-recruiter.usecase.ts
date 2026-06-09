import { ApplicationError } from "../../../../../shared/errors/application.error";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class RejectRecruiterUseCase {
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

    if (!recruiter.canBeRejected()) {
      throw new ApplicationError(
        ERROR_CODES.RECRUITER_CANNOT_BE_REJECTED,
      );
    }

    const updated = recruiter.reject();

    await this.recruiterRepo.verifyRecruiter(
      updated.getId(),
      "rejected",
    );

    try {
      await this.createNotificationUC.execute({
        recipientId: updated.getId(),
        recipientRole: "recruiter",
        title: "Verification Rejected",
        message:
          "Your recruiter verification request has been rejected. Please review your submitted information and try again.",
        type: NotificationType.RECRUITER_REJECTED,
        actionUrl: "/recruiter/profile",
        referenceId: updated.getId(),
        metadata: {
          recruiterId: updated.getId(),
        },
      });
    } catch (err) {
      console.error(
        "RECRUITER_REJECTED notification failed:",
        err,
      );
    }
  }
}