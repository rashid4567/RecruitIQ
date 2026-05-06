import type {
  PaymentRepository,
  VerifyPaymentInput,
  VerifyPaymentOutput,
} from "@/module/recruiter/Domain/repositories/payment.repository";

export class VerifyPaymentUseCase {
    private readonly paymentRepo: PaymentRepository
  constructor( paymentRepo: PaymentRepository) {
    this.paymentRepo = paymentRepo
  }

  async execute(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
    if (!input.razorpay_payment_id || !input.razorpay_subscription_id || !input.razorpay_signature) {
      throw new Error("All Razorpay payment fields are required");
    }
    return this.paymentRepo.verifyPayment(input);
  }
}