// src/pages/admin/plans/components/subscription-plan-management/PlanBasicDetails.tsx

import { CollapsibleSection } from "./CollapsibleSection";
import type { PlanFormData } from "../../hooks/Subscription.plans.Hooks/usePlanEditor"; 

interface PlanBasicDetailsProps {
  formData: PlanFormData;
  errors: Record<string, string>;
  handleChange: (field: keyof PlanFormData, value: any) => void;
}

export default function PlanBasicDetails({ 
  formData, 
  errors, 
  handleChange 
}: PlanBasicDetailsProps) {
  return (
    <CollapsibleSection title="Basic Details" defaultOpen>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Plan Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
              errors.name ? "border-red-500" : "border-zinc-300"
            }`}
            placeholder="Professional Plan"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
            placeholder="Describe what this plan offers to recruiters..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Plan Type</label>
            <select
              value={formData.planType}
              onChange={(e) => handleChange("planType", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
            >
              <option value="basic">Basic</option>
              <option value="pro">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Price (₹) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", parseInt(e.target.value) || 0)}
              className={`w-full rounded-xl border px-4 py-3 focus:border-indigo-500 ${
                errors.price ? "border-red-500" : "border-zinc-300"
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}