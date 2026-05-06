export interface CreateSubscriptionPaymentInput {
  planId: string;
}

export interface CreateSubscriptionPaymentOutput {
  razorpaySubscriptionId: string;
  razorpayKeyId: string;
  planName: string;
  amount: number;
  currency: string;
  billingCycle: string;
}

export interface VerifyPaymentInput {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentOutput {
  success: boolean;
  subscriptionId: string;
  message: string;
}

export interface PaymentRepository {
  createSubscription(
    input: CreateSubscriptionPaymentInput,
  ): Promise<CreateSubscriptionPaymentOutput>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput>;
}