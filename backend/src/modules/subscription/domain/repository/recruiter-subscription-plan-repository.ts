import { RecruiterSubscription } from "../entities/recruiter-subscription.entity";

export interface RecruiterSubscriptionRepository {
  save(subscription: RecruiterSubscription): Promise<void>;
  update(subscription: RecruiterSubscription): Promise<void>;
  findById(id: string): Promise<RecruiterSubscription | null>;
  findActiveByRecruiter(
    recruiterId: string,
  ): Promise<RecruiterSubscription | null>;
}
