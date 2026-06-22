export interface VerifyPaymentRequestDTO {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponseDTO {
  subscriptionId: string;
  paymentId: string;
  status: string;
}
