import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { CreateNotificationUseCase } from "../../../../notification/application/usecases/create-notification.usecase";
import { NotificationType } from "../../../../notification/domain/constant/notification.constants";
import { Offer } from "../../../domain/entity/offer-letter.entity";
import { OfferRepository } from "../../../domain/repository/offer-letter.repository";
import {
  RejectOfferRequestDTO,
  RejectOfferResponseDTO,
} from "../../dto/rejectOfferDTO";

export class RejectOfferUseCase implements IUseCase<
  RejectOfferRequestDTO,
  RejectOfferResponseDTO
> {
  constructor(
    private readonly offerRepo: OfferRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly jobRepo: JobRepository,
  ) {}
  async execute(input: RejectOfferRequestDTO): Promise<RejectOfferResponseDTO> {
    const offer = await this.offerRepo.findById(input.offerId);

    if (!offer) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (!offer.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACCESS);
    }

    if (!offer.canReject()) {
      throw new ApplicationError(ERROR_CODES.UNABLE_TO_REJECT_OFFER_LETTER);
    }

    offer.reject(input.remarks);

    const updateOffer = await this.offerRepo.update(offer);
    await this.sendOfferRejectedNotification(updateOffer);

    return {
      offerId: updateOffer.id,
      offerNumber: updateOffer.offerNumber,
      status: updateOffer.status,
      rejectedAt: updateOffer.rejectedAt!,
    };
  }

  private async sendOfferRejectedNotification(offer: Offer): Promise<void> {
    try {
      const job = await this.jobRepo.findById(offer.jobId);

      if (!job) {
        return;
      }

      await this.createNotificationUseCase.execute({
        recipientId: offer.recruiterId,
        recipientRole: "recruiter",
        title: "Offer Rejected",
        message: `The candidate has rejected the offer for "${job.title}".`,
        type: NotificationType.OFFER_REJECTED,
        actionUrl: "/recruiter/offers",
        referenceId: offer.id,
        metadata: {
          offerId: offer.id,
          applicationId: offer.applicationId,
          recruiterId: offer.recruiterId,
          candidateId: offer.candidateId,
          jobId: offer.jobId,
          rejectedAt: offer.rejectedAt,
        },
      });
    } catch (error) {
      console.error("Failed to create offer rejected notification:", error);
    }
  }
}
