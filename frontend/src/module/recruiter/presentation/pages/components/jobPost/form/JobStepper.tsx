import { Check, Info, FileText, Code, DollarSign, Eye } from "lucide-react";

interface JobStepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: Set<number>;
}

const steps = [
  { number: 1, title: "Basic Info", description: "Title, location, type", icon: Info },
  { number: 2, title: "Description", description: "Role overview & duties", icon: FileText },
  { number: 3, title: "Skills & Exp", description: "Requirements & skills", icon: Code },
  { number: 4, title: "Compensation", description: "Salary & deadline", icon: DollarSign },
  { number: 5, title: "Preview", description: "Review & publish", icon: Eye },
];

export default function JobStepper({ currentStep, setCurrentStep, completedSteps }: JobStepperProps) {
  const totalCompleted = completedSteps.size;
  const progress = Math.round((totalCompleted / 4) * 100);

  return (
    <div className="w-72 shrink-0">
      <div className="sticky top-8">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/80 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-5 bg-gradient-to-br from-indigo-600 to-violet-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base tracking-tight">Create Job Post</h3>
              <span className="text-indigo-200 text-xs font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 bg-indigo-500/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-indigo-200 text-xs mt-2">
              {totalCompleted === 4 ? "Ready to publish! 🚀" : `${4 - totalCompleted} step${4 - totalCompleted !== 1 ? "s" : ""} remaining`}
            </p>
          </div>

          {/* Steps */}
          <div className="p-4 space-y-1">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.has(step.number);
              const isActive = currentStep === step.number;
              const isClickable = isCompleted || step.number <= Math.max(...Array.from(completedSteps), 0) + 1;

              return (
                <button
                  key={step.number}
                  onClick={() => isClickable && setCurrentStep(step.number)}
                  disabled={!isClickable}
                  className={`group w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 shadow-sm"
                      : isCompleted
                      ? "hover:bg-gray-50 cursor-pointer"
                      : isClickable
                      ? "hover:bg-gray-50 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {/* Step Number / Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-600 shadow-lg shadow-indigo-200 scale-105"
                        : isCompleted
                        ? "bg-emerald-500"
                        : "bg-gray-100"
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    ) : (
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                    )}
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-tight transition-colors ${
                      isActive ? "text-indigo-700" : isCompleted ? "text-gray-700" : "text-gray-500"
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-xs mt-0.5 transition-colors ${
                      isActive ? "text-indigo-500" : isCompleted ? "text-emerald-600" : "text-gray-400"
                    }`}>
                      {isActive ? "In progress" : isCompleted ? "✓ Done" : step.description}
                    </p>
                  </div>

                  {/* Right indicator */}
                  {isActive && (
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer tip */}
          <div className="mx-4 mb-4 px-3 py-2.5 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">
              💡 Use <kbd className="px-1 py-0.5 bg-amber-100 rounded text-amber-600 font-mono text-xs">→</kbd> <kbd className="px-1 py-0.5 bg-amber-100 rounded text-amber-600 font-mono text-xs">←</kbd> keys to navigate steps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}