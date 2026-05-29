import { z } from "zod";

const VALID_PLAN_TYPES = ["free", "basic", "pro", "enterprise"] as const;

const VALID_BILLING_CYCLES = ["weekly", "monthly", "yearly"] as const;

const VALID_CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;

const FeaturesAccessSchema = z.object({
  interviewScheduling: z.boolean(),
  advancedAnalytics: z.boolean(),
  prioritySupport: z.boolean(),
  resumeParsing: z.boolean(),
  aiResumeScoring: z.boolean(),
  candidateShortlisting: z.boolean(),
  exportReports: z.boolean(),
});

const PlanFeatureSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Feature name must be at least 2 characters")
    .max(100, "Feature name cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&()]+$/, "Feature name contains invalid characters"),

  included: z.boolean(),
});

const BasePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Plan name must be at least 2 characters")
    .max(100, "Plan name cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Plan name contains invalid characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  planType: z.enum(VALID_PLAN_TYPES),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(100000, "Price exceeds allowed limit"),
  currency: z.enum(VALID_CURRENCIES),
  billingCycle: z.enum(VALID_BILLING_CYCLES),
  billingInterval: z
    .number()
    .int("Billing interval must be an integer")
    .min(1, "Billing interval must be at least 1")
    .max(12, "Billing interval cannot exceed 12"),
  jobPostsPerMonth: z.number().int().min(-1, "Use -1 for unlimited").max(10000),
  screeningCredits: z
    .number()
    .int()
    .min(-1, "Use -1 for unlimited")
    .max(100000),
  resumeParsesPerMonth: z
    .number()
    .int()
    .min(-1, "Use -1 for unlimited")
    .max(100000),
  aiScoreCredits: z.number().int().min(-1, "Use -1 for unlimited").max(100000),
  featuresAccess: FeaturesAccessSchema,
  features: z
    .array(PlanFeatureSchema)
    .min(1, "At least one feature is required")
    .max(25, "Maximum 25 features allowed"),
  isPopular: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(1000).default(0),
  razorpayPlanId: z
    .string()
    .trim()
    .regex(/^plan_[a-zA-Z0-9]+$/, "Invalid Razorpay Plan ID")
    .optional(),
});

export const CreatePlanSchema = BasePlanSchema.superRefine((data, ctx) => {
  const featureNames = data.features.map((feature) =>
    feature.name.toLowerCase(),
  );
  if (new Set(featureNames).size !== featureNames.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["features"],
      message: "Duplicate feature names are not allowed",
    });
  }
  if (data.planType === "free" && data.price !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Free plan must have price 0",
    });
  }
  if (data.planType !== "free" && data.price <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Paid plans must have a price greater than 0",
    });
  }
  if (data.planType === "free" && data.razorpayPlanId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["razorpayPlanId"],
      message: "Free plans cannot have Razorpay Plan ID",
    });
  }
  const enabledFeatures = Object.values(data.featuresAccess).filter(Boolean);
  if (data.planType !== "free" && enabledFeatures.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["featuresAccess"],
      message: "Paid plans must enable at least one feature",
    });
  }
});

export const UpdatePlanSchema = z
  .object({
    name: BasePlanSchema.shape.name.optional(),
    description: BasePlanSchema.shape.description.optional(),
    price: BasePlanSchema.shape.price.optional(),
    currency: BasePlanSchema.shape.currency.optional(),
    billingCycle: BasePlanSchema.shape.billingCycle.optional(),
    billingInterval: BasePlanSchema.shape.billingInterval.optional(),
    jobPostsPerMonth: BasePlanSchema.shape.jobPostsPerMonth.optional(),
    screeningCredits: BasePlanSchema.shape.screeningCredits.optional(),
    resumeParsesPerMonth: BasePlanSchema.shape.resumeParsesPerMonth.optional(),
    aiScoreCredits: BasePlanSchema.shape.aiScoreCredits.optional(),
    featuresAccess: FeaturesAccessSchema.partial().optional(),
    features: z.array(PlanFeatureSchema).max(25).optional(),
    isPopular: z.boolean().optional(),
    sortOrder: z.number().int().min(0).max(1000).optional(),
    razorpayPlanId: BasePlanSchema.shape.razorpayPlanId.optional(),
  })
  .strict();
export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;
