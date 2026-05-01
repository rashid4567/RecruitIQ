import { useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { usePlanEditor } from "../hooks/Subscription.plans.Hooks/usePlanEditor";

import PlanHeader from "../components/subscription-plan-management/PlanHeader";
import PlanBasicDetails from "../components/subscription-plan-management/PlanBasicDetails";
import PlanBillingConfig from "../components/subscription-plan-management/PlanBillingConfig";
import PlanLimitsQuotas from "../components/subscription-plan-management/PlanLimitsQuotas";
import PlanFeatureAccess from "../components/subscription-plan-management/PlanFeatureAccess";
import PlanFeaturesManagement from "../components/subscription-plan-management/PlanFeaturesManagement";
import PlanPreview from "../components/subscription-plan-management/PlanPreview";
import PlanSettings from "../components/subscription-plan-management/PlanSettings";
import PlanQuotaSummary from "../components/subscription-plan-management/PlanQuotaSummary";
import FixedBottomBar from "../components/subscription-plan-management/FixedBottomBar";

export default function PlanEditor() {
  const { id } = useParams<{ id: string }>();

  const {
    formData,
    loading,
    saving,
    errors,
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

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
              >
                ← Back to Plans
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-xl border border-zinc-300 text-sm font-medium hover:bg-zinc-50 transition-colors">
                Preview Plan
              </button>

              <button
                onClick={() => window.history.back()}
                className="px-5 py-2.5 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Discard Changes
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 
                           text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update Plan"
                ) : (
                  "Create Plan"
                )}
              </button>
            </div>
          </div>
        </header>

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-8">
                <PlanBasicDetails
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
                <PlanBillingConfig
                  formData={formData}
                  handleChange={handleChange}
                />
                <PlanLimitsQuotas
                  formData={formData}
                  handleChange={handleChange}
                />
                <PlanFeatureAccess
                  formData={formData}
                  handleFeaturesAccessChange={handleFeaturesAccessChange}
                />
                <PlanFeaturesManagement
                  features={formData.features}
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
