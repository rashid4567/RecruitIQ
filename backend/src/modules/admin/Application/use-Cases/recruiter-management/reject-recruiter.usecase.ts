import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { rejectRecruiterRequestDTO } from "../../dto/recruiter.dto/recruiter.status.dto";

export class RejectRecruiterUseCase implements UseCase<rejectRecruiterRequestDTO,void> {
  constructor(
    private readonly recruiterRepo: RecruiterRepository,
    private readonly createNotificationUC: CreateNotificationUseCase,
  ) {}

  async execute(request : rejectRecruiterRequestDTO): Promise<void> {
    const recruiter =
      await this.recruiterRepo.findById(request.recruiterId);

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