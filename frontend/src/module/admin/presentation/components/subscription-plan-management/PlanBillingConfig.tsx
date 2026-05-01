// src/pages/admin/plans/components/subscription-plan-management/PlanBillingConfig.tsx

import { CollapsibleSection } from "./CollapsibleSection";
import { Calendar, Clock } from "lucide-react";
import type { PlanFormData } from "../../hooks/Subscription.plans.Hooks/usePlanEditor"; 

interface PlanBillingConfigProps {
  formData: PlanFormData;
  handleChange: (field: keyof PlanFormData, value: any) => void;
}

export default function PlanBillingConfig({ 
  formData, 
  handleChange 
}: PlanBillingConfigProps) {
  return (
    <CollapsibleSection title="Billing Configuration">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-400" />
                Billing Cycle
              </span>
            </label>
            <select
              value={formData.billingCycle}
              onChange={(e) => handleChange("billingCycle", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" />
                Billing Interval
              </span>
            </label>
            <input
              type="number"
              min={1}
              value={formData.billingInterval}
              onChange={(e) => handleChange("billingInterval", parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
            />
            <p className="text-xs text-zinc-400 mt-1">e.g. 1 = every 1 month</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Razorpay Plan ID
          </label>
          <input
            type="text"
            value={formData.razorpayPlanId || ""}
            onChange={(e) => handleChange("razorpayPlanId", e.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 font-mono text-sm focus:border-indigo-500"
            placeholder="plan_XXXXXXXXXXXX"
          />
          <p className="text-xs text-zinc-400 mt-1">Required for all paid plans</p>
        </div>
      </div>
    </CollapsibleSection>
  );
}