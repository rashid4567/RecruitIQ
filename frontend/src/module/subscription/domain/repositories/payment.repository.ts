export interface CreateSubscriptionPaymentInput {
  planId: string;
}

export interface CreateSubscriptionPaymentOutput {
  paymentId: string;
  orderId: string;
  razorpayKeyId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentType: string;
}

export interface VerifyPaymentInput {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentOutput {
  subscriptionId: string;
  paymentId: string;
  status: string;
}

export interface PaymentRepository {
  createSubscription(
    input: CreateSubscriptionPaymentInput,
  ): Promise<CreateSubscriptionPaymentOutput>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput>;
}
