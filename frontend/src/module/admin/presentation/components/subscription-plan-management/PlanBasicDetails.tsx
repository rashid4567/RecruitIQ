import { CollapsibleSection } from "./CollapsibleSection";
import type { PlanFormData } from "../../hooks/Subscription.plans.Hooks/usePlanEditor";

export const PLAN_TYPES = ["free", "basic", "pro", "enterprise"] as const;

interface PlanBasicDetailsProps {
  formData: PlanFormData;
  errors: Record<string, string>;
  handleChange: (field: keyof PlanFormData, value: string | number) => void;
}

export default function PlanBasicDetails({
  formData,
  errors,
  handleChange,
}: PlanBasicDetailsProps) {
  return (
    <CollapsibleSection title="Basic Details" defaultOpen>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Plan Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              errors.name
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                : "border-zinc-300 bg-white focus:border-indigo-500 focus:ring-indigo-100"
            }`}
            placeholder="Professional Plan"
          />
          {errors.name && (
            <p className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600">
              <svg
                className="h-3.5 w-3.5 shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 resize-y ${
              errors.description
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                : "border-zinc-300 bg-white focus:border-indigo-500 focus:ring-indigo-100"
            }`}
            placeholder="Describe what this plan offers to recruiters..."
          />
          <div className="flex items-start justify-between mt-1.5">
            {errors.description ? (
              <p className="flex items-center gap-1.5 text-sm text-red-600">
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                </svg>
                {errors.description}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-zinc-400 shrink-0 ml-2">
              {formData.description?.length ?? 0}/300
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Plan Type
            </label>
            <select
              value={formData.planType}
              onChange={(e) => handleChange("planType", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {PLAN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                handleChange("price", parseInt(e.target.value) || 0)
              }
              disabled={formData.planType === "free"}
              className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 ${
                errors.price
                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                  : "border-zinc-300 bg-white focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            {errors.price ? (
              <p className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600">
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                </svg>
                {errors.price}
              </p>
            ) : formData.planType === "free" ? (
              <p className="text-xs text-zinc-400 mt-1">
                Free plans have no price
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
