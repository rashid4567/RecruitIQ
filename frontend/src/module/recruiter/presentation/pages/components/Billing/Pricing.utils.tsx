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
import type { SubscriptionPlan } from "@/module/recruiter/Domain/entities/SubscriptionPlan.entity";

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
          name: "Multi-location Posting",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
          ),
        },
        {
          name: "Custom Application Forms",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
          ),
        },
        {
          name: "Scheduled Posting",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
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
          name: "AI Candidate Matching",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.advancedAnalytics ?? false,
            ]),
          ),
        },
        {
          name: "Advanced Search Filters",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
          ),
        },
        {
          name: "Candidate Scoring",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
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
              p.featuresAccess?.interviewScheduling
                ? p.planType === "enterprise"
                  ? "Automated + Calendar Sync"
                  : "Automated"
                : "Manual",
            ]),
          ),
        },
        {
          name: "Team Collaboration",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.planType === "free"
                ? false
                : p.planType === "enterprise"
                  ? "Unlimited"
                  : "Up to 10",
            ]),
          ),
        },
        {
          name: "In-app Messaging",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
          ),
        },
        {
          name: "Video Interview",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
          ),
        },
      ],
    },
    {
      category: "Analytics & Reporting",
      features: [
        {
          name: "Basic Analytics",
          values: Object.fromEntries(plans.map((p) => [p.id, true])),
        },
        {
          name: "Advanced Reports",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.advancedAnalytics ?? false,
            ]),
          ),
        },
        {
          name: "Custom Dashboards",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.advancedAnalytics ?? false,
            ]),
          ),
        },
        {
          name: "DEI Reporting",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType === "enterprise"]),
          ),
        },
      ],
    },
    {
      category: "Security & Compliance",
      features: [
        {
          name: "SSL Encryption",
          values: Object.fromEntries(plans.map((p) => [p.id, true])),
        },
        {
          name: "GDPR Compliance",
          values: Object.fromEntries(plans.map((p) => [p.id, true])),
        },
        {
          name: "Two-Factor Auth",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType !== "free"]),
          ),
        },
        {
          name: "SSO (SAML/OIDC)",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType === "enterprise"]),
          ),
        },
        {
          name: "Audit Logs",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.planType === "free"
                ? false
                : p.planType === "enterprise"
                  ? "Unlimited"
                  : "30 days",
            ]),
          ),
        },
      ],
    },
    {
      category: "Integration & API",
      features: [
        {
          name: "API Access",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.planType === "free"
                ? false
                : p.planType === "enterprise"
                  ? "Full Access"
                  : "Read-only",
            ]),
          ),
        },
        {
          name: "Webhooks",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.planType === "free"
                ? false
                : p.planType === "enterprise"
                  ? "Unlimited"
                  : "5",
            ]),
          ),
        },
        {
          name: "Custom Integrations",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType === "enterprise"]),
          ),
        },
        {
          name: "White-label Options",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType === "enterprise"]),
          ),
        },
      ],
    },
    {
      category: "Support & Services",
      features: [
        {
          name: "Email Support",
          values: Object.fromEntries(plans.map((p) => [p.id, true])),
        },
        {
          name: "Priority Support",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.featuresAccess?.prioritySupport ?? false,
            ]),
          ),
        },
        {
          name: "Phone Support",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType === "enterprise"]),
          ),
        },
        {
          name: "Response Time",
          values: Object.fromEntries(
            plans.map((p) => [
              p.id,
              p.planType === "free"
                ? "48 hours"
                : p.planType === "enterprise"
                  ? "1 hour SLA"
                  : "4 hours",
            ]),
          ),
        },
        {
          name: "Dedicated Account Manager",
          values: Object.fromEntries(
            plans.map((p) => [p.id, p.planType === "enterprise"]),
          ),
        },
      ],
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
