import React from "react";
import { CheckCircle } from "lucide-react";
import { type DS, SM, PIPELINE } from "./Index";

export function PipelineTracker({
  current,
  isRejected,
  isWithdrawn,
}: {
  current: DS;
  isRejected: boolean;
  isWithdrawn: boolean;
}) {
  if (isRejected || isWithdrawn) {
    const s = SM[isRejected ? "Rejected" : "Withdrawn"];
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold ${s.bg} ${s.border} ${s.color}`}
      >
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        {isRejected ? "Rejected" : "Withdrawn"}
      </div>
    );
  }

  const currentIdx = PIPELINE.indexOf(current);

  return (
    <div className="flex items-center gap-1.5">
      {PIPELINE.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const s = SM[step];
        const label = step === "Interview Scheduled" ? "Interview" : step;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200"
                    : active
                      ? `bg-white ${s.border} ring-4 ${s.ring}`
                      : "bg-white border-slate-200"
                }`}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : active ? (
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap tracking-wide ${
                  active
                    ? s.color
                    : done
                      ? "text-emerald-600"
                      : "text-slate-300"
                }`}
              >
                {label.toUpperCase()}
              </span>
            </div>
            {i < PIPELINE.length - 1 && (
              <div
                className={`h-0.5 w-10 mb-4 rounded-full transition-colors duration-300 ${
                  i < currentIdx ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
