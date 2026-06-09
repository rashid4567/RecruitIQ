import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { SendEmailByEventUseCase } from "../../../../email/application/usecase/email-template/send-email-by-event.usecase";
import { EmailEvent } from "../../../../email/domain/constant/templateEvents";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { JobApplication } from "../../../domain/entity/job-application.entity";
import { APPLICATION_ERRORS } from "../../../domain/error/Application.error";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";

import { ApplyJobDTO } from "../../dto/applyJobDto";

export class ApplyJobUseCase {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly resumeRepo: ResumeRepository,
    private readonly userRepo: UserRepository,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
    private readonly createNotificationUC: CreateNotificationUseCase,
 
  ) {}

  async execute(dto: ApplyJobDTO): Promise<JobApplication> {
    const { jobId, candidateId, resumeId, coverLetter } = dto;

    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_NOT_FOUND);
    }
    if (!job.canApply()) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_NOT_ACTIVE);
    }
    if (job.isExpired()) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_EXPIRED);
    }

    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) {
      throw new ApplicationError(APPLICATION_ERRORS.RESUME_NOT_FOUND);
    }
    if (resume.getCandidateId() !== candidateId) {
      throw new ApplicationError(
        APPLICATION_ERRORS.UNAUTHORIZED_CANDIDATE_ACTION,
      );
    }

    const existing = await this.applicationRepo.findExistingApplication(
      candidateId,
      jobId,
    );
    if (existing) {
      throw new ApplicationError(APPLICATION_ERRORS.APPLICATION_ALREADY_EXISTS);
    }

    const application = JobApplication.apply({
      jobId,
      candidateId,
      recruiterId: job.recruiterId,
      resumeId,
      coverLetter,
    });

    const created = await this.applicationRepo.create(application);
    job.incrementApplications();
    await this.jobRepo.save(job);

    const candidate = await this.userRepo.findById(candidateId);

    try{
      await this.createNotificationUC.execute({
        recipientId : job.recruiterId,
        recipientRole : "recruiter",
        title : "New Job Application",
        message : `${candidate?.fullName ?? "A candidate"}applied for a ${job.title}`,
        type : NotificationType.JOB_APPLIED,
        actionUrl : `/recruiter/applications/${created.id}`,
        referenceId : created.id,
        metadata : {
          applicationId : created.id,
          candidateId,
          jobId,
          jobTitle : job.title,
        }
      })
    }catch(err){
      console.error("Job_applied notification failed :",err)
    }

    if(candidate){
      try{
        await this.sendEmailByEventUC.execute({
        to : candidate.email.getValue(),
        event : EmailEvent.JOB_APPLIED,
        variables : {
          candidateName : candidate.fullName,
          jobTitle : job.title,
          companyName : job.companyName,
          applicationDate : new Date().toLocaleDateString(), 
        }
      })
      }catch(err){
        console.error("JOB_APPLIED email failed :", err);
      }
    }

    
    return created;
  }
}
