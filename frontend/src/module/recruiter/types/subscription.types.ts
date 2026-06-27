export const BillingCycle = {
  Weekly: "weekly",
  Monthly: "monthly",
  Yearly: "yearly",
} as const;

export type BillingCycle = typeof BillingCycle[keyof typeof BillingCycle];

export const Currency = {
  INR: "INR",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
} as const;

export type Currency = typeof Currency[keyof typeof Currency];

export const PlanType = {
  Free: "free",
  Basic: "basic",
  Pro: "pro",
  Enterprise: "enterprise",
} as const;

export type PlanType = typeof PlanType[keyof typeof PlanType];