// export interface CreateSubscriptionPaymentInput {
//   planId: string;
// }

// export interface CreateSubscriptionPaymentOutput {
//   orderId: string;
//   razorpayKeyId: string;
//   planName: string;
//   amount: number;
//   currency: string;
// }

// export interface VerifyPaymentInput {
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   razorpay_signature: string;
// }

// export interface VerifyPaymentOutput {
//   success: boolean;
//   subscriptionId: string;
//   message: string;
// }

// export interface PaymentRepository {
//   createSubscription(
//     input: CreateSubscriptionPaymentInput,
//   ): Promise<CreateSubscriptionPaymentOutput>;
//   verifyPayment(
//     input: VerifyPaymentInput
//   ): Promise<VerifyPaymentOutput>;
// }