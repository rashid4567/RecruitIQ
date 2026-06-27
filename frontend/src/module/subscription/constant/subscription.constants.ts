export const PlanType = {
  Free: "free",
  Basic: "basic",
  Pro: "pro",
  Enterprise: "enterprise",
} as const;

export type PlanType =
  (typeof PlanType)[keyof typeof PlanType];

export const BillingCycle = {
  Weekly: "weekly",
  Monthly: "monthly",
  Yearly: "yearly",
} as const;

export type BillingCycle =
  (typeof BillingCycle)[keyof typeof BillingCycle];

export const Currency = {
  INR: "INR",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
} as const;

export type Currency =
  (typeof Currency)[keyof typeof Currency];

export const SubscriptionStatus = {
  Pending: "pending",
  Active: "active",
  Cancelled: "cancelled",
  Expired: "expired",
  PastDue: "past_due",
  Trialing: "trialing",
  Paused: "paused",
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const CancellationReason = {
  UserRequested: "user_requested",
  PaymentFailed: "payment_failed",
  Upgraded: "upgraded",
  Downgraded: "downgraded",
  AdminAction: "admin_action",
} as const;

export type CancellationReason =
  (typeof CancellationReason)[keyof typeof CancellationReason];

export const PaymentStatus = {
  Pending: "pending",
  Paid: "paid",
  Failed: "failed",
} as const;

export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentType = {
  Subscription: "subscription",
  Upgrade: "upgrade",
  Renewal: "renewal",
} as const;

export type PaymentType =
  (typeof PaymentType)[keyof typeof PaymentType];