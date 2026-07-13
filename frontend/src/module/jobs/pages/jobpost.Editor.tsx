import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCreateJobPost } from "../hooks/Recruiter-jobPost/useCreateJobPost";
import { useUpdateJobPost } from "../hooks/Recruiter-jobPost/useUpdateJobPost";
import type { JobFormData } from "../hooks/Recruiter-jobPost/useCreateJobPost";
import Step1BasicInfo from "./components/jobpost/form/Step1BasicInfo";
import Step2Description from "./components/jobpost/form/Step2Description";
import Step3Requirements from "./components/jobpost/form/Step3Requirements";
import Step4Compensation from "./components/jobpost/form/Step4Compensation";
import Step5Preview from "./components/jobpost/form/Step5Preview";
import Sidebar from "../../recruiter/pages/components/layout/Sidebar";
import Header from "../../../pages/landing/sections/Header";
import JobStepper from "./components/jobpost/form/JobStepper";
import PublishDialog from "./components/jobpost/PublishDialog";
import SaveDraftDialog from "./components/jobpost/SaveDraftDialog";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { ChevronLeft, ChevronRight, Save, Rocket } from "lucide-react";
import { useCurrentSubscription } from "@/module/subscription/hooks/subscriptions/useCurrentSubscription";

function CreateMode() {
  const hook = useCreateJobPost();
  return <JobEditorUI isEditMode={false} {...hook} />;
}

function EditMode({ jobId }: { jobId: string }) {
  const hook = useUpdateJobPost(jobId);
  return <JobEditorUI isEditMode={true} {...hook} />;
}

export default function JobEditorPage() {
  const { id: jobId } = useParams<{ id?: string }>();
  return (
    <>
      <Toaster position="top-right" richColors expand duration={4000} />
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
  formData: JobFormData;
  setFormData: Dispatch<SetStateAction<JobFormData>>;
  stepErrors?: Record<string, string>;
  showSaveDraftModal?: boolean;
  isSavingDraft?: boolean;
  saveDraftError?: string | null;
  draftSavedSuccessfully?: boolean;
  handleNavigateAway?: () => boolean;
  handleNext?: () => Record<string, string> | void;
  handlePrevious?: () => void;
  saveDraft?: () => Promise<void>;
  dismissSaveDraftModal?: () => void;
  showPublishConfirmation: boolean;
  isPublishing: boolean;
  publishError: string | null;
  handlePublish: () => void;
  confirmPublish: () => Promise<void>;
  confirmSaveDraft?: () => Promise<void>;
  dismissPublishConfirmation: () => void;
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
  stepErrors = {},
  showSaveDraftModal = false,
  isSavingDraft = false,
  saveDraftError = null,
  draftSavedSuccessfully = false,
  handleNavigateAway,
  handleNext,
  handlePrevious,
  saveDraft,
  dismissSaveDraftModal,
  showPublishConfirmation,
  isPublishing,
  publishError,
  handlePublish,
  confirmPublish,
  confirmSaveDraft,
  dismissPublishConfirmation,
}: JobEditorUIProps) {
  const navigate = useNavigate();

  const { data: subscription } = useCurrentSubscription();

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const errors = Object.keys(stepErrors).length > 0 ? stepErrors : localErrors;

  const goNext = () => {
    if (handleNext) {
      const result = handleNext();
      setLocalErrors(result ?? {});
    } else {
      if (currentStep < 5) setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (handlePrevious) {
      handlePrevious();
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showPublishConfirmation || showSaveDraftModal) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag || "")) return;
      if (e.key === "ArrowRight" && currentStep < 5) {
        goNext();
      } else if (e.key === "ArrowLeft" && currentStep > 1) {
        goPrev();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [
    currentStep,
    showPublishConfirmation,
    showSaveDraftModal,
    goNext,
    goPrev,
  ]);

  useEffect(() => {
    if (!handleNavigateAway) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (handleNavigateAway()) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [handleNavigateAway]);

  const renderStep = () => {
    const commonProps = { formData, setFormData, errors };
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...commonProps} />;
      case 2:
        return <Step2Description {...commonProps} />;
      case 3:
        return <Step3Requirements {...commonProps} />;
      case 4:
        return (
          <Step4Compensation
            {...commonProps}
            jobPostActiveDays={subscription?.jobPostActiveDays}
          />
        );
      case 5:
        return <Step5Preview formData={formData} />;
      default:
        return null;
    }
  };
  console.log(subscription);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="hidden lg:block">
          <Sidebar activeItem="jobs" />
        </div>

        <div className="flex-1 overflow-x-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm font-medium">
              Loading job post...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="hidden lg:block">
          <Sidebar activeItem="jobs" />
        </div>
        <div className="flex-1 overflow-x-hidden flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <p className="text-red-500 font-semibold">{loadError}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="rounded-xl"
            >
              🔄 Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-gray-100">
      <div className="hidden lg:block">
        <Sidebar activeItem="jobs" />
      </div>


      <div className="flex-1 overflow-x-hidden">
        <Header />

        <div className="flex gap-8 p-8 max-w-7xl mx-auto w-full">
          <div className="hidden lg:block">
            <JobStepper
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              completedSteps={completedSteps}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-5">
            {isEditMode && (
              <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5">
                <span className="text-lg">✏️</span>
                <div>
                  <span className="text-amber-800 text-sm font-bold">
                    Editing job post
                  </span>
                  <span className="text-amber-500 text-sm ml-2">
                    — Changes apply only after you confirm
                  </span>
                </div>
              </div>
            )}

            {!isEditMode && draftSavedSuccessfully && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5">
                <span className="text-emerald-500 text-lg">✓</span>
                <span className="text-emerald-800 text-sm font-semibold">
                  Draft saved successfully
                </span>
              </div>
            )}

            <div className="lg:hidden">
              <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
                <span>Step {currentStep} of 5</span>
                <span>{Math.round((currentStep / 5) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-indigo-500 to-violet-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 24, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.99 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 p-8"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between px-1">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentStep === 1 || isPublishing}
                className="h-11 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {!isEditMode && saveDraft && (
                  <Button
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isSavingDraft || isPublishing}
                    className="h-11 px-5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    {isSavingDraft ? (
                      <>
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Draft
                      </>
                    )}
                  </Button>
                )}

                {currentStep === 5 ? (
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="h-11 px-8 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-200/60 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    {isPublishing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        {isEditMode ? "Save Changes" : "Publish Job"}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={goNext}
                    disabled={isPublishing}
                    className="h-11 px-8 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-200/60 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isEditMode && dismissSaveDraftModal && saveDraft && (
        <SaveDraftDialog
          open={showSaveDraftModal}
          isSaving={isSavingDraft}
          error={saveDraftError}
          onSave={saveDraft}
          onDiscard={dismissSaveDraftModal}
        />
      )}

      <PublishDialog
        open={showPublishConfirmation}
        onOpenChange={(open) => {
          if (!open) dismissPublishConfirmation();
        }}
        onConfirm={confirmPublish}
        onSaveDraft={
          isEditMode && confirmSaveDraft ? confirmSaveDraft : undefined
        }
        onPublish={isEditMode ? confirmPublish : undefined}
        onSuccess={() => navigate("/recruiter/jobs")}
        isSubmitting={isPublishing}
        jobTitle={formData.title}
        error={publishError}
        onRetry={
          isEditMode && confirmSaveDraft ? confirmSaveDraft : confirmPublish
        }
        isEditMode={isEditMode}
      />
    </div>
  );
}
