// src/pages/admin/plans/components/subscription-plan-management/PlanFeatureAccess.tsx

import { CollapsibleSection } from "./CollapsibleSection";
import { Calendar, BarChart2, ShieldCheck } from "lucide-react";
import { Toggle } from "./Toggle";
import type { PlanFormData } from "../../hooks/Subscription.plans.Hooks/usePlanEditor"; 

interface PlanFeatureAccessProps {
  formData: PlanFormData;
  handleFeaturesAccessChange: (
    key: keyof PlanFormData["featuresAccess"], 
    value: boolean
  ) => void;
}

export default function PlanFeatureAccess({ 
  formData, 
  handleFeaturesAccessChange 
}: PlanFeatureAccessProps) {
  return (
    <CollapsibleSection title="Feature Access Controls">
      <p className="text-sm text-zinc-500 mb-5">
        Control which premium capabilities this plan unlocks for subscribers.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800">Interview Scheduling</p>
              <p className="text-xs text-zinc-500">Allow automated interview booking with candidates</p>
            </div>
          </div>
          <Toggle
            checked={formData.featuresAccess.interviewScheduling}
            onChange={() => handleFeaturesAccessChange("interviewScheduling", !formData.featuresAccess.interviewScheduling)}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
              <BarChart2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800">Advanced Analytics</p>
              <p className="text-xs text-zinc-500">Detailed hiring funnel metrics and reports</p>
            </div>
          </div>
          <Toggle
            checked={formData.featuresAccess.advancedAnalytics}
            onChange={() => handleFeaturesAccessChange("advancedAnalytics", !formData.featuresAccess.advancedAnalytics)}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800">Priority Support</p>
              <p className="text-xs text-zinc-500">Dedicated support with faster response times</p>
            </div>
          </div>
          <Toggle
            checked={formData.featuresAccess.prioritySupport}
            onChange={() => handleFeaturesAccessChange("prioritySupport", !formData.featuresAccess.prioritySupport)}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}