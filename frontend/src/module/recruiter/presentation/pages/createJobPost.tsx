import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCreateJobPost } from "../hooks/jobPost/useCreateJobPost";
import { useUpdateJobPost } from "../hooks/jobPost/useUpdateJobPost";
import Step1BasicInfo from "./components/jobPost/form/Step1BasicInfo";
import Step2Description from "./components/jobPost/form/Step2Description";
import Step3Requirements from "./components/jobPost/form/Step3Requirements";
import Step4Compensation from "./components/jobPost/form/Step4Compensation";
import Step5Preview from "./components/jobPost/form/Step5Preview";
import Sidebar from "../pages/components/layout/Sidebar";
import Header from "@/components/candidate/header";
import JobStepper from "./components/jobPost/form/JobStepper";
import PublishDialog from "./components/jobPost/PublishDialog";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

function CreateMode() {
  const hook = useCreateJobPost();
  return <JobEditorUI isEditMode={false} {...hook} />;
}

function EditMode({ jobId }: { jobId: string }) {
  const hook = useUpdateJobPost(jobId, "");
  return <JobEditorUI isEditMode={true} {...hook} />;
}

export default function JobEditorPage() {
  const { id: jobId } = useParams<{ id?: string }>();
  return (
    <>
      <Toaster position="top-right" richColors expand={true} duration={4000} />
      {jobId ? <EditMode jobId={jobId} /> : <CreateMode />}
    </>
  );
}

type JobEditorUIProps = {
  isEditMode: boolean;
  isLoading?: boolean;
  loadError?: string | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: Set<number>;
  formData: any;
  setFormData: any;
  showConfirmation: boolean;
  setShowConfirmation: (v: boolean) => void;
  isSubmitting: boolean;
  publishError: string | null;
  handleNext: () => void;
  handlePrevious: () => void;
  handlePublish: () => void;
  confirmPublish: () => Promise<void>;
  retryPublish: () => void;
};

function JobEditorUI({
  isEditMode,
  isLoading,
  loadError,
  currentStep,
  setCurrentStep,
  completedSteps,
  formData,
  setFormData,
  showConfirmation,
  setShowConfirmation,
  isSubmitting,
  publishError,
  handleNext,
  handlePrevious,
  handlePublish,
  confirmPublish,
  retryPublish,
}: JobEditorUIProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showConfirmation) return;
      if (e.key === "ArrowRight" && currentStep < 5) handleNext();
      else if (e.key === "ArrowLeft" && currentStep > 1) handlePrevious();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentStep, handleNext, handlePrevious, showConfirmation]);

  useEffect(() => {
    if (isEditMode) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      const hasData =
        formData.title ||
        formData.description ||
        formData.requiredSkills.length > 0 ||
        formData.responsibilities.length > 0;
      if (hasData && !showConfirmation) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [formData, showConfirmation, isEditMode]);

  const progressPercentage = (currentStep / 5) * 100;

  const renderStep = () => {
    const stepProps = { formData, setFormData };
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...stepProps} />;
      case 2:
        return <Step2Description {...stepProps} />;
      case 3:
        return <Step3Requirements {...stepProps} />;
      case 4:
        return <Step4Compensation {...stepProps} />;
      case 5:
        return <Step5Preview formData={formData} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <Sidebar activeItem="jobs" />
        <div className="flex-1 ml-72 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading job post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <Sidebar activeItem="jobs" />
        <div className="flex-1 ml-72 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <p className="text-red-500 font-semibold text-lg">{loadError}</p>
            <p className="text-gray-400 text-sm">
              Could not load the job post. Please try again.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2 border-red-200 text-red-500 hover:bg-red-50"
            >
              🔄 Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Sidebar activeItem="jobs" />

      <div className="flex-1 ml-72">
        <Header />

        <div className="flex gap-8 p-8 max-w-7xl mx-auto">
          <div className="hidden lg:block">
            <JobStepper
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              completedSteps={completedSteps}
            />
          </div>

          <div className="flex-1 min-w-0">
         
            {isEditMode && (
              <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                <span className="text-amber-600 text-sm font-semibold">
                  ✏️ Editing job post
                </span>
                <span className="text-amber-500 text-sm">
                  — Changes apply only after you confirm
                </span>
              </div>
            )}


            <div className="lg:hidden mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep} of 5</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-indigo-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 min-h-150"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 px-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
                className="px-8 border-2 hover:bg-gray-50 transition-all duration-200"
              >
                ← Previous
              </Button>

              {currentStep === 5 ? (
                <Button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-10 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isEditMode ? "Saving..." : "Publishing..."}
                    </>
                  ) : isEditMode ? (
                    "💾 Save Changes"
                  ) : (
                    "🚀 Publish Job"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="px-10 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Continue →
                </Button>
              )}
            </div>

            <div className="flex justify-center gap-2 mt-8 lg:hidden">
              {[1, 2, 3, 4, 5].map((step) => (
                <button
                  key={step}
                  onClick={() =>
                    completedSteps.has(step - 1) && setCurrentStep(step)
                  }
                  className={`h-2 rounded-full transition-all duration-200 ${
                    currentStep === step
                      ? "w-8 bg-indigo-600"
                      : completedSteps.has(step)
                        ? "w-2 bg-green-500"
                        : "w-2 bg-gray-300"
                  }`}
                  disabled={!completedSteps.has(step - 1) && step < currentStep}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PublishDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={confirmPublish}
        isSubmitting={isSubmitting}
        jobTitle={formData.title}
        error={publishError}
        onRetry={retryPublish}
        isEditMode={isEditMode}
      />
    </div>
  );
}
