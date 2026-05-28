import { Pencil, ChevronRight } from "lucide-react";
import type { PlanFormData } from "../../../hooks/Admin.Subscription.plans.Hooks/usePlanEditor";


interface PlanHeaderProps {
  formData: Pick<PlanFormData, "name" | "isPopular">;
  isEditMode: boolean;
}

export default function PlanHeader({ formData, isEditMode }: PlanHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          Plans <ChevronRight className="h-4 w-4" />{" "}
          {isEditMode ? "Edit" : "Create"} Plan
        </div>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-3xl font-bold text-zinc-900">
            {formData.name || (isEditMode ? "Edit Plan" : "New Subscription Plan")}
          </h1>
          {isEditMode && (
            <button className="text-zinc-400 hover:text-zinc-600">
              <Pencil className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-4 py-1.5 text-xs font-medium rounded-full ${
            formData.isPopular
              ? "bg-amber-100 text-amber-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {formData.isPopular ? "Popular Plan" : "Standard"}
        </span>
      </div>
    </div>
  );
}