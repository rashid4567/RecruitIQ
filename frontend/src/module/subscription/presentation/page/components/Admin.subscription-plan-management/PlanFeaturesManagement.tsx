import { CollapsibleSection } from "./CollapsibleSection";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface PlanFeaturesManagementProps {
  features: { name: string; included: boolean }[];
  errors: Record<string, string>;
  updateFeature: (
    index: number,
    updates: Partial<{ name: string; included: boolean }>,
  ) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
}

export default function PlanFeaturesManagement({
  features,
  errors,
  updateFeature,
  addFeature,
  removeFeature,
}: PlanFeaturesManagementProps) {
  return (
    <CollapsibleSection title="Features Management">
      <div className="mb-4 flex items-center justify-between">
        <div>
          {errors.features && (
            <p className="flex items-center gap-1.5 text-sm text-red-600">
              <svg
                className="h-3.5 w-3.5 shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
              </svg>
              {errors.features}
            </p>
          )}
        </div>
        <button
          onClick={addFeature}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Feature
        </button>
      </div>

      {features.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-10 text-center">
          <p className="text-sm text-zinc-400">No features added yet.</p>
          <button
            onClick={addFeature}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + Add your first feature
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature, index) => {
            const isEmpty = !feature.name?.trim();
            return (
              <div key={index} className="group">
                <div
                  className={`flex items-center gap-4 rounded-2xl border bg-white p-4 transition-colors ${
                    isEmpty
                      ? "border-red-300 bg-red-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <GripVertical className="h-5 w-5 text-zinc-300 cursor-grab shrink-0" />

                  <input
                    type="text"
                    value={feature.name}
                    onChange={(e) =>
                      updateFeature(index, { name: e.target.value })
                    }
                    placeholder="Feature name"
                    className={`flex-1 bg-transparent border-0 focus:outline-none font-medium text-zinc-900 placeholder:text-zinc-300 ${
                      isEmpty ? "text-red-600" : ""
                    }`}
                  />

                  <button
                    onClick={() =>
                      updateFeature(index, { included: !feature.included })
                    }
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                      feature.included
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                    }`}
                  >
                    {feature.included ? "Included" : "Excluded"}
                  </button>

                  <button
                    onClick={() => removeFeature(index)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all shrink-0"
                    title="Remove feature"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {isEmpty && (
                  <p className="flex items-center gap-1.5 mt-1 ml-1 text-xs text-red-600">
                    <svg
                      className="h-3 w-3 shrink-0"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                    </svg>
                    Feature name cannot be empty
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
}
