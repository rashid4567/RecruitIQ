import { CheckCircle2 } from "lucide-react";
import type { RecruiterSubscription } from "@/module/subscription/types/RecruiterSubscription.types";

interface PlanFeaturesProps {
  subscription: RecruiterSubscription;
}

export default function PlanFeatures({
  subscription,
}: PlanFeaturesProps) {
  const features = [
    {
      name: "Job Posts",
      value: subscription.jobPostsLimit,
      unit: "/month",
    },
    {
      name: "Job Visibility",
      value: subscription.jobPostActiveDays,
      unit: "days",
    },
    {
      name: "Screening Credits",
      value: subscription.screeningLimit,
      unit: "credits",
    },
 
    {
      name: "AI Scoring",
      value: subscription.aiScoreLimit,
      unit: "credits",
    },
    {
      name: "Team Members",
      value: "Unlimited",
      unit: "",
    },
    {
      name: "Priority Support",
      value: "24/7",
      unit: "",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        What's Included
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
              {feature.name}
            </p>

            <p className="text-xl font-bold text-slate-900">
              {feature.value}
              <span className="ml-1 text-xs font-normal text-slate-500">
                {feature.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}