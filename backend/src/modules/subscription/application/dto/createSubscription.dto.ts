import { PaymentType } from "../../domain/entities/payment.entity";
import {
  FeatureAccess,
  PlanFeature,
} from "../../domain/entities/subscription-plan.entity";



export interface CreateSubscriptionPlanRequestDTO {
  name: string;
  description?: string;
  planType: "free" | "basic" | "pro" | "enterprise";
  price: number;
  currency: "INR" | "USD" | "EUR" | "GBP";
  billingCycle: "weekly" | "monthly" | "yearly";
  billingInterval: number;
  jobPostsPerMonth: number;
  jobPostActiveDays: number;
  screeningCredits: number;
  aiScoreCredits: number;
  featuresAccess: FeatureAccess;
  features: PlanFeature[];
  isPopular?: boolean;
  sortOrder?: number;
  razorpayPlanId?: string;
}        


export interface CreatePaymentOrderRequestDTO {
  recruiterId: string;
  planId: string;
  durationMonths: number;
}

export interface CreatePaymentOrderResponseDTO {
  paymentId: string;
  orderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  planName: string;
  paymentType: PaymentType;
}