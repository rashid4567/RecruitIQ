import {
  Currency,
  EmploymentType,
  Offer,
} from "../../../domain/entity/offer-letter.entity";
import { OfferRepository } from "../../../domain/repository/offer-letter.repository";

import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";

import {
  ApplicationStatus,
  JobApplication,
} from "../../../../job-application/domain/entity/job-application.entity";

import {
  CreateOfferRequestDTO,
  CreateOfferResponseDTO,
} from "../../dto/createOfferDTO";

import { JobRepository } from "../../../../job/domain/repositories/job.repository";

import { UserRepository } from "../../../../auth/domain/repositories/user.repository";

import { SendEmailByEventUseCase } from "../../../../email/application/usecase/email-template/send-email-by-event.usecase";

import { EmailEvent } from "../../../../email/domain/constant/templateEvents";

import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";

import { NotificationType } from "../../../../notification/domain/constant/notification.constants";

import { ApplicationError } from "../../../../../shared/errors/application.error";

import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
type Candidate = NonNullable<Awaited<ReturnType<UserRepository["findById"]>>>;
type JobEntity = NonNullable<Awaited<ReturnType<JobRepository["findById"]>>>;

export class CreateOfferUseCase implements IUseCase<
  CreateOfferRequestDTO,
  CreateOfferResponseDTO
> {
  constructor(
    private readonly offerRepo: OfferRepository,
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly userRepo: UserRepository,
    private readonly sendEmailByEventUC: SendEmailByEventUseCase,
    private readonly createNotificationUC: CreateNotificationUseCase,
  ) {}

  async execute(
    request: CreateOfferRequestDTO,
  ): Promise<CreateOfferResponseDTO> {
   
    const application = await this.applicationRepo.findById(
      request.applicationId,
    );

    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (!application.belongsToRecruiter(request.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    if (application.status === ApplicationStatus.REJECTED) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_ALREADY_REJECTED);
    }

    if (application.status === ApplicationStatus.SELECTED) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_ALREADY_SELECTED);
    }

  
    const offerExists = await this.offerRepo.existsByApplicationId(
      application.id,
    );

    if (offerExists) {
      throw new ApplicationError(ERROR_CODES.OFFER_ALREADY_EXISTS);
    }

    const job = await this.jobRepo.findById(application.jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_NOT_FOUND);
    }

    if (job.isBlocked) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_IS_BLOCKED_BY_ADMIN);
    }

 
    const candidate = await this.userRepo.findById(application.candidateId);

    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

  
    const currentYear = new Date().getFullYear();

    const offerNumber = `OFF-${currentYear}-${Date.now()}`;

    const offer = Offer.create({
      offerNumber,
      applicationId: application.id,
      jobId: application.jobId,
      candidateId: application.candidateId,
      recruiterId: request.recruiterId,
      companyName: job.companyName,
      jobTitle: job.title,
      annualCTC: request.annualCTC,
      currency: request.currency as Currency,
      employmentType: request.employmentType as EmploymentType,
      department: request.department,
      workLocation: request.workLocation,
      joiningDate: request.joiningDate,
      probationPeriod: request.probationPeriod,
      benefits: request.benefits,
      notes: request.notes,
      offerDate: new Date(),
      expiryDate: request.expiryDate,
    });

   
    const createdOffer = await this.offerRepo.create(offer);

    const offerLink = `${process.env.CLIENT_URL}/candidate/offers/${createdOffer.id}`;

    createdOffer.sendOffer(offerLink);
    await this.offerRepo.update(createdOffer);


    application.select();

    await this.applicationRepo.save(application);
    await this.sendOfferEmail(candidate, job, request, offerLink);
    await this.createOfferNotification(application, job, createdOffer);
    return {
      offerId: createdOffer.id,
      offerNumber: createdOffer.offerNumber,
      status: createdOffer.status,
    };
  }

  private async sendOfferEmail(
  candidate: Candidate,
  job: JobEntity,
  request: CreateOfferRequestDTO,
  offerLink: string,
): Promise<void> {
  try {
    await this.sendEmailByEventUC.execute({
      to: candidate.email.getValue(),
      event: EmailEvent.SELECTED,
      variables: {
        candidateName: candidate.fullName,
        jobTitle: job.title,
        companyName: job.companyName,
        offerLink,
      },
    });
  } catch (error) {
    console.error("Failed to send offer email:", error);
  }
}

  private async createOfferNotification(
    application: JobApplication,
    job: JobEntity,
    createdOffer: Offer,
  ): Promise<void> {
    try {
      await this.createNotificationUC.execute({
        recipientId: application.candidateId,
        recipientRole: "candidate",

        title: "Employment Offer Ready",

        message: `Congratulations! Your employment offer for ${job.title} at ${job.companyName} is ready.`,

        type: NotificationType.APPLICATION_SELECTED,

        actionUrl: `/candidate/offers/${createdOffer.id}`,

        referenceId: createdOffer.id,

        metadata: {
          offerId: createdOffer.id,
          applicationId: application.id,
          jobId: application.jobId,
        },
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  }
}
