import { useCompleteProfile } from "../hooks/useCompleteProfileForm" 
import { RecruiterProfileHeader } from "./components/completeProfile/RecruiterProfileHeader"
import { ProgressBar } from "./components/completeProfile/ProgressBar"
import { CompanyForm, type CompanyFormData } from "./components/completeProfile/CompanyForm"
import { PricingPlans } from "./components/completeProfile/PricingPlans"
import { ActionButtons } from "./components/completeProfile/ActionButtons"

export default function RecruiterDetails() {
  const {
    formData,
    errors,
 
    isSubmitting,
    progress,
    handleInputChange,
    handleSubmit,
  } = useCompleteProfile();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 py-8">
      <div className="relative max-w-6xl mx-auto px-4">
        <ProgressBar progress={progress} />

        <div className="space-y-10">
          <RecruiterProfileHeader />

          <CompanyForm
            formData={formData as CompanyFormData}
            errors={errors}
            onChange={handleInputChange}
          />

            <ActionButtons
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            progress={progress}
          />

          <PricingPlans/>

        
        </div>
      </div>
    </div>
  );
}