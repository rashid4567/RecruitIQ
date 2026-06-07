import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { DomainError } from "../../../../../shared/errors/domain.error";
import { ApplicationStatus } from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { UpdateApplicationStatusDTO } from "../../dto/UpdateApplicationStatusDTO";

export class UpdateApplicationStatusUseCase {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(
    dto: UpdateApplicationStatusDTO,
  ): Promise<void> {
    const application = await this.applicationRepo.findById(
      dto.applicationId,
    );

    if (!application) {
      throw new ApplicationError(
        ERROR_CODES.APPLICATION_NOT_FOUND,
      );
    }

    if (!application.belongsToRecruiter(dto.recruiterId)) {
      throw new ApplicationError(
        ERROR_CODES.UNAUTHORIZED_ACTION,
      );
    }

    const allowedStatuses: ApplicationStatus[] = [
      ApplicationStatus.SHORTLISTED,
      ApplicationStatus.SELECTED,
      ApplicationStatus.REJECTED,
    ];

    if (!allowedStatuses.includes(dto.status)) {
      throw new ApplicationError(
        ERROR_CODES.INVALID_APPLICATION_STATUS,
      );
    }

    try {
      switch (dto.status) {
        case ApplicationStatus.SHORTLISTED:
          application.shortlist();
          break;

        case ApplicationStatus.SELECTED:
          application.select();
          break;

        case ApplicationStatus.REJECTED:
          application.reject(
            dto.rejectionReason ?? "",
          );
          break;
      }

      await this.applicationRepo.save(application);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ApplicationError(error.message);
      }

      throw error;
    }
  }
}