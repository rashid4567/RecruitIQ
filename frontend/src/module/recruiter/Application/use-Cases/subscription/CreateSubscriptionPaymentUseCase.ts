import type {
  PaymentRepository,
  CreateSubscriptionPaymentOutput,
} from "@/module/recruiter/Domain/repositories/payment.repository";

export class CreateSubscriptionPaymentUseCase {
    private readonly paymentRepo: PaymentRepository
  constructor( paymentRepo: PaymentRepository) {
    this.paymentRepo = paymentRepo;
  }

  async execute(planId: string): Promise<CreateSubscriptionPaymentOutput> {
    if (!planId?.trim()) throw new Error("Plan ID is required");
    return this.paymentRepo.createSubscription({ planId });
  }
}