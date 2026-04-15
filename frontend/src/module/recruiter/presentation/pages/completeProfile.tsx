import { useCompleteProfile } from "../hooks/useCompleteProfileForm"
import { RecruiterProfileHeader } from "./components/completeProfile/RecruiterProfileHeader"
import { ProgressBar } from "./components/completeProfile/ProgressBar" 
import { CompanyForm } from "./components/completeProfile/CompanyForm"
import { LogoUpload } from "./components/completeProfile/LogoUpload" 
import { PricingPlans } from "./components/completeProfile/PricingPlans" 
import { ActionButtons } from "./components/completeProfile/ActionButtons"

export default function RecruiterDetails() {
  const {
    formData,
    errors,
    selectedPlan,
    isSubmitting,
    logoPreview,
    progress,
    setSelectedPlan,
    handleInputChange,
    handleLogoUpload,
    handleSubmit,
  } = useCompleteProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-8">
      <div className="relative max-w-6xl mx-auto px-4">
        <ProgressBar progress={progress} />

        <div className="space-y-10">
          <RecruiterProfileHeader />

          <CompanyForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />

          <LogoUpload
            logoPreview={logoPreview}
            onLogoUpload={handleLogoUpload}
          />

          <PricingPlans
            selectedPlan={selectedPlan}
            onPlanSelect={setSelectedPlan}
          />

          <ActionButtons
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            progress={progress}
          />
        </div>
      </div>
    </div>
  );
} 