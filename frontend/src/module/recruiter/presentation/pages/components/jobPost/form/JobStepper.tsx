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

          <div className="relative pl-4">
            <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-200" />

            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.number);
                const isActive = currentStep === step.number;
                const isLast = index === steps.length - 1;

                return (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(step.number)}
                    className="group w-full flex items-start gap-4 text-left transition-all duration-200 hover:bg-gray-50 p-2 rounded-xl -mx-2"
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold border-2 transition-all z-10 ${
                          isActive
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110"
                            : isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-500 group-hover:border-gray-400"
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-6 mt-1 transition-colors ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                    </div>

                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : isCompleted ? "text-green-600" : "text-gray-400"}`} />
                        <span className={`font-medium ${isActive ? "text-indigo-700" : isCompleted ? "text-gray-700" : "text-gray-600"}`}>
                          {step.title}
                        </span>
                      </div>
                      {isCompleted && !isActive && <p className="text-xs text-green-600 mt-0.5">Completed</p>}
                      {isActive && <p className="text-xs text-indigo-600 mt-0.5">In Progress</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}