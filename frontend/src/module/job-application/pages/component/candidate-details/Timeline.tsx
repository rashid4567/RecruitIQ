import { Check } from "lucide-react";

export interface TimelineStep {
  stepIndex: number;
  title: string;
  description: string;
  date?: string;
  note?: string;
}

interface TimelineProps {
  timelineSteps: TimelineStep[];
  getStep: (si: number) => "done" | "active" | "pending";
}

export function Timeline({ timelineSteps, getStep }: TimelineProps) {
  const firstPendingIndex = timelineSteps.findIndex((step) => getStep(step.stepIndex) === "pending");

  return (
    <div className="pt-4">
      {timelineSteps.map((step, i) => {
        const s = getStep(step.stepIndex);
        const isDone = s === "done";
        const isActive = s === "active";
        const isComingNext = i === firstPendingIndex;
        const nextIsDone = i < timelineSteps.length - 1 && getStep(timelineSteps[i + 1].stepIndex) !== "pending";

        return (
          <div key={step.stepIndex} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100 scale-105"
                      : "bg-slate-100 text-slate-300"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.stepIndex + 1}
              </div>
              {i < timelineSteps.length - 1 && (
                <div
                  className={`w-px flex-1 my-1 transition-colors duration-300 ${
                    isDone && nextIsDone
                      ? "bg-emerald-200"
                      : isDone
                        ? "bg-linear-to-b from-emerald-200 to-slate-100"
                        : "bg-slate-100"
                  }`}
                  style={{ minHeight: "2rem" }}
                />
              )}
            </div>

            <div className={`pb-6 pt-1 flex-1 min-w-0 ${i === timelineSteps.length - 1 ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3
                  className={`text-sm font-semibold transition-colors ${
                    isDone ? "text-slate-700" : isActive ? "text-blue-700" : "text-slate-300"
                  }`}
                >
                  {step.title}
                </h3>
                {isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
                {isDone && <span className="text-[10px] font-medium text-emerald-500">✓ Complete</span>}
                {isComingNext && (
                  <span className="text-[10px] font-medium text-slate-400">Coming next</span>
                )}
              </div>
              <p
                className={`text-xs leading-relaxed transition-colors ${
                  isDone || isActive ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {step.description}
              </p>
              {step.date && <p className="text-[11px] text-slate-400 mt-1 font-medium">{step.date}</p>}
              {step.note && (
                <p className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-blue-300 inline-block" />
                  {step.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}