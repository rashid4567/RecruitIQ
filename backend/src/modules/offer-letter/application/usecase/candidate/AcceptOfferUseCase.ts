import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants"; 
import { Offer } from "../../../domain/entity/offer-letter.entity";
import { OfferRepository } from "../../../domain/repository/offer-letter.repository";
import {
  AcceptOfferRequestDTO,
  AcceptOfferResponseDTO,
} from "../../dto/AcceptOfferDTO";

export class AcceptOfferUseCase implements IUseCase<
  AcceptOfferRequestDTO,
  AcceptOfferResponseDTO
> {
  constructor(
    private readonly offerRepo: OfferRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly jobRepo: JobRepository,
  ) {}

  async execute(input: AcceptOfferRequestDTO): Promise<AcceptOfferResponseDTO> {
    const offer = await this.offerRepo.findById(input.offerId);

    if (!offer) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (!offer.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACCESS);
    }

    offer.accept(input.remarks);
    const updatedOffer = await this.offerRepo.update(offer);
    await this.sendOfferAcceptedNotification(updatedOffer);
    return {
      offerId: updatedOffer.id,
      offerNumber: updatedOffer.offerNumber,
      status: updatedOffer.status,
      acceptedAt: updatedOffer.acceptedAt!,
    };
  }

  private async sendOfferAcceptedNotification(offer: Offer): Promise<void> {
    try {
      const job = await this.jobRepo.findById(offer.jobId);

      if (!job) {
        return;
      }

      await this.createNotificationUseCase.execute({
        recipientId: offer.recruiterId,
        recipientRole: "recruiter",
        title: "Offer Accepted",
        message: `The candidate has accepted the offer for "${job.title}".`,
        type: NotificationType.OFFER_ACCEPTED,
        actionUrl: "/recruiter/offers",
        referenceId: offer.id,
        metadata: {
          offerId: offer.id,
          applicationId: offer.applicationId,
          recruiterId: offer.recruiterId,
          candidateId: offer.candidateId,
          jobId: offer.jobId,
          acceptedAt: offer.acceptedAt,
        },
      });
    } catch (error) {
      console.error("Failed to create offer accepted notification:", error);
    }
  }
}
