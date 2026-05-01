// PlanPreview.tsx
import { Check, X } from "lucide-react";

interface PlanPreviewProps {
  formData: any;
}

export default function PlanPreview({ formData }: PlanPreviewProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h3 className="font-semibold text-zinc-900 mb-4">Plan Preview</h3>
      <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6">
        {formData.isPopular && (
          <div className="inline-block mb-3 px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
            MOST POPULAR
          </div>
        )}

        <div className="text-5xl font-bold text-zinc-900 mb-1">
          ₹{formData.price.toLocaleString()}
        </div>
        <p className="text-zinc-500">per {formData.billingCycle}</p>

        <div className="my-6 h-px bg-zinc-200" />

        <h4 className="font-semibold mb-4">{formData.name || "Plan Name"}</h4>

        {formData.description && (
          <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
            {formData.description}
          </p>
        )}

        <ul className="space-y-3 text-sm text-zinc-600">
          {formData.features.slice(0, 6).map((f: any, i: number) => (
            <li key={i} className="flex items-center gap-2">
              {f.included ? (
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-zinc-400 flex-shrink-0" />
              )}
              <span className={f.included ? "" : "text-zinc-400 line-through"}>
                {f.name}
              </span>
            </li>
          ))}
        </ul>

        {(formData.featuresAccess.interviewScheduling ||
          formData.featuresAccess.advancedAnalytics ||
          formData.featuresAccess.prioritySupport) && (
          <div className="mt-5 pt-4 border-t border-zinc-200">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Premium Access
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.featuresAccess.interviewScheduling && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  Scheduling
                </span>
              )}
              {formData.featuresAccess.advancedAnalytics && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                  Analytics
                </span>
              )}
              {formData.featuresAccess.prioritySupport && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                  Priority Support
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}