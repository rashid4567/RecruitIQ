import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { usePlanEditor } from "../hooks/Admin.Subscription.plans.Hooks/usePlanEditor";
import PlanHeader from "./components/Admin.subscription-plan-management/PlanHeader";
import PlanBasicDetails from "./components/Admin.subscription-plan-management/PlanBasicDetails";
import PlanBillingConfig from "./components/Admin.subscription-plan-management/PlanBillingConfig";
import PlanLimitsQuotas from "./components/Admin.subscription-plan-management/PlanLimitsQuotas";
import PlanFeatureAccess from "./components/Admin.subscription-plan-management/PlanFeatureAccess";
import PlanFeaturesManagement from "./components/Admin.subscription-plan-management/PlanFeaturesManagement";
import PlanPreview from "./components/Admin.subscription-plan-management/PlanPreview";
import PlanSettings from "./components/Admin.subscription-plan-management/PlanSettings";
import PlanQuotaSummary from "./components/Admin.subscription-plan-management/PlanQuotaSummary";
import FixedBottomBar from "./components/Admin.subscription-plan-management/FixedBottomBar";

export default function PlanEditor() {
  const { id } = useParams<{ id: string }>();

  const {
    formData,
    loading,
    saving,
    errors,
    saveError,
    saveSuccess,
    isEditMode,
    handleChange,
    handleFeaturesAccessChange,
    updateFeature,
    addFeature,
    removeFeature,
    handleSave,
  } = usePlanEditor(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500 font-medium">Loading plan...</p>
        </div>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="flex h-screen bg-zinc-50">
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8 max-w-350 mx-auto">
            <PlanHeader formData={formData} isEditMode={isEditMode} />

            {isEditMode && (
              <div className="mt-6 mb-8 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Important Note</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Any changes to pricing or features will only apply to
                    existing subscribers from their next billing cycle.
                  </p>
                </div>
              </div>
            )}

            {saveError && (
              <div className="mt-4 mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <svg
                  className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Failed to save plan
                  </p>
                  <p className="text-sm text-red-600 mt-0.5">{saveError}</p>
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="mt-4 mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <svg
                  className="h-5 w-5 text-emerald-500 shrink-0"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.28 5.03a.75.75 0 0 0-1.06-1.06L6.75 8.44 5.78 7.47a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3.5-3.5z" />
                </svg>
                <p className="text-sm font-semibold text-emerald-700">
                  Plan saved successfully! Redirecting…
                </p>
              </div>
            )}

            {hasErrors && (
              <div className="mt-4 mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <svg
                  className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Please fix the following errors before saving
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {Object.entries(errors)
                      .filter(([, msg]) => !!msg)
                      .map(([field, msg]) => (
                        <li key={field} className="text-sm text-red-600">
                          • {msg}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-8">
                <PlanBasicDetails
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
                <PlanBillingConfig
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
                <PlanLimitsQuotas
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
                <PlanFeatureAccess
                  formData={formData}
                  handleFeaturesAccessChange={handleFeaturesAccessChange}
                />
                <PlanFeaturesManagement
                  features={formData.features}
                  errors={errors}
                  updateFeature={updateFeature}
                  addFeature={addFeature}
                  removeFeature={removeFeature}
                />
              </div>
              <div className="lg:col-span-5 space-y-8">
                <PlanPreview formData={formData} />
                <PlanSettings formData={formData} handleChange={handleChange} />
                <PlanQuotaSummary formData={formData} />
              </div>
            </div>
          </div>
        </div>

        <FixedBottomBar
          isEditMode={isEditMode}
          saving={saving}
          onSave={handleSave}
          onCancel={() => window.history.back()}
        />
      </main>
    </div>
  );
}
