import {
  Briefcase,
  Brain,
  Calendar,
  BarChart2,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

import type { PlanFormData } from "../../hooks/Subscription.plans.Hooks/usePlanEditor";

interface PlanQuotaSummaryProps {
  formData: PlanFormData;
}

export default function PlanQuotaSummary({ formData }: PlanQuotaSummaryProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h3 className="font-semibold text-zinc-900 mb-4 text-sm">
        Quota Summary
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Briefcase className="h-4 w-4" />
            Job Posts / Month
          </span>

          <span className="font-semibold text-zinc-800">
            {formData.jobPostsPerMonth === -1
              ? "Unlimited"
              : formData.jobPostsPerMonth}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Brain className="h-4 w-4" />
            Screening Credits
          </span>

          <span className="font-semibold text-zinc-800">
            {formData.screeningCredits === -1
              ? "Unlimited"
              : formData.screeningCredits}
          </span>
        </div>

        <div className="h-px bg-zinc-100 my-1" />

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Calendar className="h-4 w-4" />
            Interview Scheduling
          </span>

          {formData.featuresAccess.interviewScheduling ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <X className="h-4 w-4 text-zinc-300" />
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <BarChart2 className="h-4 w-4" />
            Advanced Analytics
          </span>

          {formData.featuresAccess.advancedAnalytics ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <X className="h-4 w-4 text-zinc-300" />
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <ShieldCheck className="h-4 w-4" />
            Priority Support
          </span>

          {formData.featuresAccess.prioritySupport ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <X className="h-4 w-4 text-zinc-300" />
          )}
        </div>
      </div>
    </div>
  );
}
