import { Mail, Calendar, Briefcase, ChevronRight } from "lucide-react";
import { type DS, SM, PIPELINE } from "./Index";
import { getInitials, fmt } from "./Indexs";

function PipelineStep({
  label,
  state,
}: {
  label: string;
  state: "done" | "active" | "upcoming";
}) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div
        className={`w-2 h-2 rounded-full transition-all ${
          state === "done"
            ? "bg-indigo-500"
            : state === "active"
              ? "bg-indigo-600 ring-4 ring-indigo-100"
              : "bg-slate-200"
        }`}
      />
      <span
        className={`text-[11px] font-semibold tracking-wide ${
          state === "active"
            ? "text-indigo-700"
            : state === "done"
              ? "text-slate-500"
              : "text-slate-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function ConnectorLine({ done }: { done: boolean }) {
  return (
    <div
      className={`h-px w-5 shrink-0 ${done ? "bg-indigo-300" : "bg-slate-200"}`}
    />
  );
}

function InlinePipeline({
  current,
  isRejected,
  isWithdrawn,
}: {
  current: DS;
  isRejected: boolean;
  isWithdrawn: boolean;
}) {
  if (isRejected) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-500">
        <span className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100" />
        Application Rejected
      </span>
    );
  }
  if (isWithdrawn) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        Candidate Withdrew
      </span>
    );
  }

  const activeIdx = PIPELINE.indexOf(current);

  return (
    <div className="flex items-center flex-wrap gap-y-1">
      {PIPELINE.map((step, i) => {
        const state =
          i < activeIdx ? "done" : i === activeIdx ? "active" : "upcoming";
        return (
          <div key={step} className="flex items-center">
            <PipelineStep label={step} state={state} />
            {i < PIPELINE.length - 1 && <ConnectorLine done={i < activeIdx} />}
          </div>
        );
      })}
    </div>
  );
}

function Avatar({ name, dot }: { name: string; dot: string }) {
  return (
    <div className="relative shrink-0">
      <div className="w-18 h-18 rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200 select-none tracking-tight">
        {getInitials(name)}
      </div>
      <span
        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${dot}`}
      />
    </div>
  );
}

export function CandidateHero({
  candidateName,
  candidateEmail,
  appliedAt,
  ds,
  isRejected,
  isWithdrawn,
}: {
  candidateName: string | undefined;
  candidateEmail: string | undefined;
  appliedAt: string | undefined;
  ds: DS;
  isRejected: boolean;
  isWithdrawn: boolean;
}) {
  const sm = SM[ds];
  const name = candidateName ?? "Unknown Candidate";

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="h-1 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500" />

      <div className="max-w-7xl mx-auto px-8 pt-15 pb-7">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-5">
            <Avatar name={name} dot={sm.dot} />

            <div className="space-y-2.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  {name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sm.bg} ${sm.border} ${sm.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                  {ds}
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {candidateEmail && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    {candidateEmail}
                  </span>
                )}
                {appliedAt && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    Applied {fmt(appliedAt)}
                  </span>
                )}
              </div>

              <InlinePipeline
                current={ds}
                isRejected={isRejected}
                isWithdrawn={isWithdrawn}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium self-start pt-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Applications</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 font-semibold">{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
