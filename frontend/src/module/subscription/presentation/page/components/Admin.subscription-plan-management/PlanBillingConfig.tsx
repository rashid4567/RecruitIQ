import { CollapsibleSection } from "./CollapsibleSection";
import { Calendar, Clock } from "lucide-react";
import type { PlanFormData } from "../../../hooks/Admin.Subscription.plans.Hooks/usePlanEditor";

interface PlanBillingConfigProps {
  formData: PlanFormData;
  errors: Record<string, string>;
  handleChange: (field: keyof PlanFormData, value: string | number) => void;
}

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600">
      <svg
        className="h-3.5 w-3.5 shrink-0"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
      </svg>
      {message}
    </p>
  );
}

export default function PlanBillingConfig({
  formData,
  errors,
  handleChange,
}: PlanBillingConfigProps) {
  const fieldCls = (field: string) =>
    `w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
        : "border-zinc-300 bg-white focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <CollapsibleSection title="Billing Configuration">
      <div className="space-y-5">
        {/* Billing Cycle + Interval */}
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
              className={fieldCls("billingCycle")}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <ErrorMsg message={errors.billingCycle} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" />
                Billing Interval <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="number"
              min={1}
              value={formData.billingInterval}
              onChange={(e) =>
                handleChange("billingInterval", parseInt(e.target.value) || 1)
              }
              className={fieldCls("billingInterval")}
            />
            {errors.billingInterval ? (
              <ErrorMsg message={errors.billingInterval} />
            ) : (
              <p className="text-xs text-zinc-400 mt-1">
                e.g. 1 = every 1 month
              </p>
            )}
          </div>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
            className={fieldCls("currency")}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          <ErrorMsg message={errors.currency} />
        </div>

        {/* Razorpay Plan ID */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Razorpay Plan ID{" "}
            {formData.planType !== "free" && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <input
            type="text"
            value={formData.razorpayPlanId || ""}
            onChange={(e) => handleChange("razorpayPlanId", e.target.value)}
            disabled={formData.planType === "free"}
            className={`font-mono text-sm disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 ${fieldCls(
              "razorpayPlanId",
            )}`}
            placeholder="plan_XXXXXXXXXXXX"
          />
          {errors.razorpayPlanId ? (
            <ErrorMsg message={errors.razorpayPlanId} />
          ) : (
            <p className="text-xs text-zinc-400 mt-1">
              {formData.planType === "free"
                ? "Not required for free plans"
                : "Required for all paid plans"}
            </p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
