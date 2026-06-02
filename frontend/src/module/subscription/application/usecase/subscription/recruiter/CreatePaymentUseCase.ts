import type {
  CreateSubscriptionPaymentOutput,
  PaymentRepository,
} from "@/module/subscription/domain/repositories/payment.repository";

export interface CreatePaymentRequest {
  planId: string;
}

export class CreatePaymentUseCase {
  private readonly paymentRepo: PaymentRepository;
  constructor(paymentRepo: PaymentRepository) {
    this.paymentRepo = paymentRepo;
  }

  async execute(
    request: CreatePaymentRequest,
  ): Promise<CreateSubscriptionPaymentOutput> {
    if (!request.planId?.trim()) {
  throw new Error("Plan ID is required");
}

    return this.paymentRepo.createSubscription({
      planId: request.planId,
    });
  }
}
