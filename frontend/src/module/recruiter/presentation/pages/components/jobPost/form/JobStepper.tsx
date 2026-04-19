// JobStepper.tsx
import { Check, Info, FileText, Code, DollarSign, Eye } from "lucide-react";

interface JobStepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: Set<number>;
}

const steps = [
  { number: 1, title: "Basic Info", icon: Info },
  { number: 2, title: "Description", icon: FileText },
  { number: 3, title: "Skills & Exp", icon: Code },
  { number: 4, title: "Compensation", icon: DollarSign },
  { number: 5, title: "Preview", icon: Eye },
];

export default function JobStepper({ currentStep, setCurrentStep, completedSteps }: JobStepperProps) {
  return (
    <div className="w-80 shrink-0">
      <div className="sticky top-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Job Post Setup</h3>
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.has(step.number);
              const isActive = currentStep === step.number;
              
              return (
                <button
                  key={step.number}
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{step.title}</span>
                    </div>
                    {isCompleted && !isActive && (
                      <span className="text-xs text-green-600">Completed</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}