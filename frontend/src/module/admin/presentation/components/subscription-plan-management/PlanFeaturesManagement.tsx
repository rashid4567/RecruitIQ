// PlanFeaturesManagement.tsx
import { CollapsibleSection } from "./CollapsibleSection";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface PlanFeaturesManagementProps {
  features: { name: string; included: boolean }[];
  updateFeature: (index: number, updates: Partial<{ name: string; included: boolean }>) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
}

export default function PlanFeaturesManagement({
  features,
  updateFeature,
  addFeature,
  removeFeature,
}: PlanFeaturesManagementProps) {
  return (
    <CollapsibleSection title="Features Management">
      <div className="mb-4 flex justify-end">
        <button
          onClick={addFeature}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
        >
          <Plus className="h-4 w-4" /> Add New Feature
        </button>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white border border-zinc-200 rounded-2xl p-4 group"
          >
            <GripVertical className="h-5 w-5 text-zinc-400 cursor-grab" />

            <input
              type="text"
              value={feature.name}
              onChange={(e) => updateFeature(index, { name: e.target.value })}
              className="flex-1 bg-transparent border-0 focus:outline-none font-medium text-zinc-900"
            />

            <button
              onClick={() => updateFeature(index, { included: !feature.included })}
              className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                feature.included
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {feature.included ? "Included" : "Excluded"}
            </button>

            <button
              onClick={() => removeFeature(index)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-2"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}