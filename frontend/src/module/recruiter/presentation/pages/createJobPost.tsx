'use client';

import React from "react";

import { Button } from "@/components/ui/button";
import { useJobEditor } from "../hooks/jobPost/useJobEditor";
import Step1BasicInfo from "./components/jobPost/form/Step1BasicInfo";
import Step2Description from "./components/jobPost/form/Step2Description";
import Step3Requirements from "./components/jobPost/form/Step3Requirements";
import Step4Compensation from "./components/jobPost/form/Step4Compensation";
import Step5Preview from "./components/jobPost/form/Step5Preview";
import  Sidebar  from "../pages/components/layout/Sidebar"
import Header from "@/components/candidate/header";
import JobStepper from "./components/jobPost/form/JobStepper";
import PublishDialog from "./components/jobPost/PublishDialog";

export default function JobEditorPage() {
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    formData,
    setFormData,
    showConfirmation,
    setShowConfirmation,
    isSubmitting,
    handleNext,
    handlePrevious,
    handlePublish,
    confirmPublish,
  } = useJobEditor();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2Description formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3Requirements formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step4Compensation formData={formData} setFormData={setFormData} />;
      case 5:
        return <Step5Preview formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem="jobs" />

      {/* Main Content */}
      <div className="flex-1 ml-72">
        <Header />

        <div className="flex gap-8 p-8">
          {/* Stepper Sidebar */}
          <JobStepper
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
          />

          {/* Form Content */}
          <div className="flex-1 max-w-3xl">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[600px]">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 px-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-8"
              >
                Previous
              </Button>

              {currentStep === 5 ? (
                <Button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 px-10"
                >
                  {isSubmitting ? "Publishing..." : "Publish Job"}
                </Button>
              ) : (
                <Button onClick={handleNext} className="px-10">
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Dialog */}
      <PublishDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={confirmPublish}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}