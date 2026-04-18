import { Check, Briefcase, User, FileText, Layers, DollarSign, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { number: 1, title: "Basic Information", description: "Job title, department & type", icon: User },
  { number: 2, title: "Job Description", description: "Describe the role", icon: FileText },
  { number: 3, title: "Requirements & Skills", description: "What candidates need", icon: Layers },
  { number: 4, title: "Compensation", description: "Salary & benefits", icon: DollarSign },
  { number: 5, title: "Preview & Publish", description: "Review and go live", icon: Eye },
];

export default function JobStepper({
  currentStep,
  setCurrentStep,
  completedSteps,
}: {
  currentStep: number;
  setCurrentStep: (n: number) => void;
  completedSteps: number[];
}) {
  return (
    <div className="w-80 bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">New Job Posting</h2>
          <p className="text-xs text-gray-500">Step {currentStep} of 5</p>
        </div>
      </div>

      <div className="mb-6 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${(currentStep / 5) * 100}%` }} />
      </div>

      <div className="space-y-2">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = completedSteps.includes(step.number);
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                isActive ? "bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100" : "hover:bg-gray-50"
              )}
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                isActive ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white" :
                isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
              )}>
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div>
                <p className={cn("text-sm font-medium", isActive ? "text-indigo-700" : isCompleted ? "text-emerald-700" : "text-gray-700")}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}