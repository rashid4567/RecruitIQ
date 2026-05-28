import { Schema, model, Document } from "mongoose";

export enum BillingCycle {
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export enum PlanType {
  Free = "free",
  Basic = "basic",
  Pro = "pro",
  Enterprise = "enterprise",
}

export interface IFeaturesAccess {
  interviewScheduling: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  resumeParsing: boolean;
  aiResumeScoring: boolean;
  candidateShortlisting: boolean;
  exportReports: boolean;
}

export interface IFeature {
  name: string;
  included: boolean;
}

export interface ISubscriptionPlan extends Document {
  name: string;
  description?: string;
  planType: PlanType;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingInterval: number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
  featuresAccess: IFeaturesAccess;
  features: IFeature[];
  razorpayPlanId?: string;
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    included: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const FeaturesAccessSchema = new Schema<IFeaturesAccess>(
  {
    interviewScheduling: {
      type: Boolean,
      default: false,
    },

    advancedAnalytics: {
      type: Boolean,
      default: false,
    },

    prioritySupport: {
      type: Boolean,
      default: false,
    },

    resumeParsing: {
      type: Boolean,
      default: false,
    },

    aiResumeScoring: {
      type: Boolean,
      default: false,
    },

    candidateShortlisting: {
      type: Boolean,
      default: false,
    },

    exportReports: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    planType: {
      type: String,
      enum: Object.values(PlanType),
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.INR,
    },

    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
      default: BillingCycle.Monthly,
    },

    billingInterval: {
      type: Number,
      min: 1,
      default: 1,
    },

    jobPostsPerMonth: {
      type: Number,
      min: -1,
      default: 5,
    },

    screeningCredits: {
      type: Number,
      min: -1,
      default: 10,
    },

    resumeParsesPerMonth: {
      type: Number,
      min: -1,
      default: 20,
    },

    aiScoreCredits: {
      type: Number,
      min: -1,
      default: 50,
    },

    featuresAccess: {
      type: FeaturesAccessSchema,

      default: () => ({
        interviewScheduling: false,
        advancedAnalytics: false,
        prioritySupport: false,
        resumeParsing: false,
        aiResumeScoring: false,
        candidateShortlisting: false,
        exportReports: false,
      }),
    },

    features: {
      type: [FeatureSchema],
      default: [],
    },

    razorpayPlanId: {
      type: String,
      unique: true,
      sparse: true,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

subscriptionPlanSchema.index({
  isActive: 1,
  sortOrder: 1,
});

subscriptionPlanSchema.index({
  planType: 1,
  isActive: 1,
});

subscriptionPlanSchema.index({
  price: 1,
});

subscriptionPlanSchema.index({
  isPopular: 1,
});
subscriptionPlanSchema.index({
  razorpayPlanId: 1,
});

export const SubscriptionPlanModel = model<ISubscriptionPlan>(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);
