// src/pages/admin/plans/components/subscription-plan-management/PlanSettings.tsx

import { CollapsibleSection } from "./CollapsibleSection";
import { Star } from "lucide-react";
import { Toggle } from "./Toggle";
import type { PlanFormData } from "../../hooks/Subscription.plans.Hooks/usePlanEditor"; 

interface PlanSettingsProps {
  formData: PlanFormData;
  handleChange: (field: keyof PlanFormData, value: any) => void;
}

export default function PlanSettings({ formData, handleChange }: PlanSettingsProps) {
  return (
    <CollapsibleSection title="Plan Settings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-700 font-medium flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500" />
              Mark as Popular Plan
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Highlights this plan with a "Popular" badge
            </p>
          </div>
          <Toggle
            checked={formData.isPopular ?? false}
            onChange={() => handleChange("isPopular", !formData.isPopular)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => handleChange("sortOrder", parseInt(e.target.value) || 1)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />
          <p className="text-xs text-zinc-400 mt-1">Lower number = displayed first</p>
        </div>
      </div>
    </CollapsibleSection>
  );
}