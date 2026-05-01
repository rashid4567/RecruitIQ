// src/pages/admin/plans/components/subscription-plan-management/PlanLimitsQuotas.tsx

import { CollapsibleSection } from "./CollapsibleSection";
import { Briefcase, Brain } from "lucide-react";
import type { PlanFormData } from "../../hooks/Subscription.plans.Hooks/usePlanEditor"

interface PlanLimitsQuotasProps {
  formData: PlanFormData;
  handleChange: (field: keyof PlanFormData, value: any) => void;
}

export default function PlanLimitsQuotas({ 
  formData, 
  handleChange 
}: PlanLimitsQuotasProps) {
  return (
    <CollapsibleSection title="Limits & Quotas">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-zinc-700 mb-2 block">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-zinc-400" />
              Job Posts per Month
            </span>
          </label>
          <input
            type="number"
            value={formData.jobPostsPerMonth}
            onChange={(e) => handleChange("jobPostsPerMonth", parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <p className="text-xs text-zinc-400 mt-1">Use -1 for unlimited</p>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700 mb-2 block">
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-zinc-400" />
              AI Screening Credits
            </span>
          </label>
          <input
            type="number"
            value={formData.screeningCredits}
            onChange={(e) => handleChange("screeningCredits", parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <p className="text-xs text-zinc-400 mt-1">Use -1 for unlimited</p>
        </div>
      </div>
    </CollapsibleSection>
  );
}