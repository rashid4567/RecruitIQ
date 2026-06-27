import type { PaymentStatus, PaymentType } from "../constant/subscription.constants";


export interface Payment {
  id: string;
  recruiterId: string;
  planId: string;
  durationMonths: number;
  subscriptionId?: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPaymentInput {
  planId: string;
  durationMonths: number;
}

export interface CreateSubscriptionPaymentOutput {
  paymentId: string;
  orderId: string;
  razorpayKeyId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentType: string;
  durationMonths: number;
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