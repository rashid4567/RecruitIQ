import {
  Rocket,
  Star,
  Crown,
  Building2,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Lock,
  Webhook,
  Headphones,
} from "lucide-react";
import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";

export const getDisplayPrice = (
  plan: SubscriptionPlan,
  yearly: boolean,
): string => {
  if (plan.isFree) return "Free";
  const monthly = plan.price ?? 0;
  const price = yearly ? Math.round(monthly * 0.8) : monthly;
  const symbol = plan.currency === "INR" ? "₹" : "$";
  return `${symbol}${price.toLocaleString("en-IN")}`;
};

export const getYearlyTotal = (plan: SubscriptionPlan): string => {
  if (plan.isFree) return "";
  const monthly = plan.price ?? 0;
  const symbol = plan.currency === "INR" ? "₹" : "$";
  const yearly = Math.round(monthly * 0.8 * 12);
  return `${symbol}${yearly.toLocaleString("en-IN")}/year`;
};

export const getDisplayJobPosts = (plan: SubscriptionPlan): string => {
  if (plan.jobPostsPerMonth === -1) return "Unlimited";
  return (plan.jobPostsPerMonth ?? 0).toString();
};

export const getDisplayScreeningCredits = (plan: SubscriptionPlan): string => {
  if (plan.screeningCredits === -1) return "Unlimited";
  return (plan.screeningCredits ?? 0).toString();
};

export const getDisplayResumeParsing = (plan: SubscriptionPlan): string => {
  if (plan.resumeParsesPerMonth === -1) return "Unlimited";
  return (plan.resumeParsesPerMonth ?? 0).toString();
};

export const getDisplayAiScoreCredits = (plan: SubscriptionPlan): string => {
  if (plan.aiScoreCredits === -1) return "Unlimited";
  return (plan.aiScoreCredits ?? 0).toString();
};

export const getPlanCTA = (plan: SubscriptionPlan): string => {
  return plan.isFree ? "Get Started Free" : "Subscribe Now";
};

export const planIcons: Record<string, React.ElementType> = {
  free: Rocket,
  basic: Star,
  pro: Crown,
  enterprise: Building2,
};

export const categoryIcons: Record<string, React.ElementType> = {
  "Job Posting & Management": FileText,
  "Candidate Management": Users,
  "Communication & Collaboration": MessageSquare,
  "Analytics & Reporting": BarChart3,
  "Security & Compliance": Lock,
  "Integration & API": Webhook,
  "Support & Services": Headphones,
};

export function buildFeatureCategories(
  plans: SubscriptionPlan[],
): FeatureCategoryRow[] {
  return [
    {
      category: "Job Posting & Management",
      features: [
        {
          name: "Active Job Postings",
          values: Object.fromEntries(
            plans.map((p) => [p.id, getDisplayJobPosts(p)]),
          ),
        },
        {
          name: "Job Post Active Days",
          values: Object.fromEntries(
            plans.map((p) => [p.id, `${p.jobPostActiveDays} days`]),
          ),
        },
        {
          name: "Resume Parsing",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.resumeParsing
                ? getDisplayResumeParsing(p)
                : false,
            ]),
          ),
        },
        {
          name: "Candidate Shortlisting",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.candidateShortlisting ?? false,
            ]),
          ),
        },
      ],
    },
    {
      category: "Candidate Management",
      features: [
        {
          name: "Screening Credits",
          values: Object.fromEntries(
            plans.map((p) => [p.id, getDisplayScreeningCredits(p)]),
          ),
        },
        {
          name: "AI Resume Scoring Credits",
          values: Object.fromEntries(
            plans.map((p) => [p.id, getDisplayAiScoreCredits(p)]),
          ),
        },
        {
          name: "AI Resume Scoring",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.aiResumeScoring ?? false,
            ]),
          ),
        },
        {
          name: "Candidate Shortlisting",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.candidateShortlisting ?? false,
            ]),
          ),
        },
      ],
    },
    {
      category: "Communication & Collaboration",
      features: [
        {
          name: "Interview Scheduling",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.interviewScheduling ? true : false,
            ]),
          ),
        },
        {
          name: "Export Reports",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.featuresAccess?.exportReports ?? false]),
          ),
        },
      ],
    },
    {
      category: "Analytics & Reporting",
      features: [
        {
          name: "Advanced Analytics",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.advancedAnalytics ?? false,
            ]),
          ),
        },
        {
          name: "Export Reports",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.featuresAccess?.exportReports ?? false]),
          ),
        },
      ],
    },
    {
      category: "Support & Services",
      features: [
        {
          name: "Priority Support",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.prioritySupport ?? false,
            ]),
          ),
        },
      ],
    },

    ...buildDynamicFeatureCategories(plans),
  ];
}

function buildDynamicFeatureCategories(
  plans: SubscriptionPlan[],
): FeatureCategoryRow[] {
  const allFeatureNames = Array.from(
    new Set(plans.flatMap((p) => (p.features ?? []).map((f) => f.name))),
  );

  if (allFeatureNames.length === 0) return [];

  return [
    {
      category: "Plan Features",
      features: allFeatureNames.map((name) => ({
        name,
        values: Object.fromEntries(
          plans.map((p) => {
            const match = (p.features ?? []).find((f) => f.name === name);

            return [p.id, match?.included ?? false];
          }),
        ),
      })),
    },
  ];
}

export interface FeatureCategoryRow {
  category: string;
  features: {
    name: string;
    values: Record<string, string | boolean>;
  }[];
}
