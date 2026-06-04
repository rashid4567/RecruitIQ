import type {
  PaymentRepository,
  VerifyPaymentOutput,
} from "@/module/subscription/domain/repositories/payment.repository";

export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export class VerifyPaymentUseCase {
  private readonly paymentRepo: PaymentRepository;

  constructor(paymentRepo: PaymentRepository) {
    this.paymentRepo = paymentRepo;
  }

  async execute(request: VerifyPaymentRequest): Promise<VerifyPaymentOutput> {
    if (!request.razorpay_payment_id) {
      throw new Error("Razorpay payment id is required");
    }

    if (!request.razorpay_order_id) {
      throw new Error("Razorpay order id is required");
    }

    if (!request.razorpay_signature) {
      throw new Error("Razorpay signature is required");
    }

    return await this.paymentRepo.verifyPayment(request);
  }
}
