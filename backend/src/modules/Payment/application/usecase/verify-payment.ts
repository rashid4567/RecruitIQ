import crypto from "crypto";
import { PaymentRepository } from "../../domain/repository/payment.repository";

export interface VerifyPaymentRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  paymentId: string;
  verified: boolean;
  subscriptionRequired: boolean;
}

export class VerifyPaymentUseCase {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly razorpaySecret: string,
  ) {}

  async execute(request: VerifyPaymentRequest) {
    const payload = `${request.razorpayOrderId}|${request.razorpayPaymentId}`;

    const generated = crypto.createHmac("sha256", this.razorpaySecret.trim(),).update(payload).digest("hex");
  }
}
