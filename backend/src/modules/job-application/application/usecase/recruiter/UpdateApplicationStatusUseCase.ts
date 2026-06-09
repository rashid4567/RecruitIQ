import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { DomainError } from "../../../../../shared/errors/domain.error";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { SendEmailByEventUseCase } from "../../../../email/application/usecase/email-template/send-email-by-event.usecase";
import { EmailEvent } from "../../../../email/domain/constant/templateEvents";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { ApplicationStatus } from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { UpdateApplicationStatusDTO } from "../../dto/UpdateApplicationStatusDTO";

export class UpdateApplicationStatusUseCase {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly userRepo : UserRepository,
    private readonly jobRepo : JobRepository,
    private readonly sendEmailByEventUC : SendEmailByEventUseCase,
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

      const candidate = await this.userRepo.findById(application.candidateId);

      const job = await this.jobRepo.findById(application.jobId);

      if(candidate && job){
        try{
          if(dto.status === ApplicationStatus.SELECTED){
            await this.sendEmailByEventUC.execute({
              to : candidate.email.getValue(),
              event : EmailEvent.SELECTED,
              variables : {
                candidateName: candidate.fullName,
                jobTitle : job.title,
                companyName : job.companyName,
              }
            })
          }

          
        if(dto.status === ApplicationStatus.REJECTED){
          await this.sendEmailByEventUC.execute({
            to : candidate.email.getValue(),
            event : EmailEvent.REJECTED,
            variables : {
              candidateName : candidate.fullName,
              jobTitle : job.title,
              companyName : job.companyName,
            }
          })
        }
        }catch(err){
          console.error(`${dto.status} email notification failed :`, err);
        }
      }
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ApplicationError(error.message);
      }

      throw error;
    }
  }
}