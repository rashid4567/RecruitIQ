import { Offer } from "../entity/offer-letter.entity";

export interface OfferRepository {
  create(offer: Offer): Promise<Offer>;
  update(offer: Offer): Promise<Offer>;
  findById(id: string): Promise<Offer | null>;
  findByOfferNumber(offerNumber: string): Promise<Offer | null>;
  findByApplicationId(applicationId: string): Promise<Offer | null>;
  findByCandidateId(candidateId: string): Promise<Offer[]>;
  findByRecruiterId(recruiterId: string): Promise<Offer[]>;
  existsByApplicationId(applicationId: string): Promise<boolean>;
  findExpiredOffers(currentDate: Date): Promise<Offer[]>;
  softDelete(id: string): Promise<void>;
}

