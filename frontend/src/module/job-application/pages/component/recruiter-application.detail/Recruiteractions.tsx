import React from "react";
import {
  CheckCircle,
  ChevronRight,
  UserCheck,
  CalendarPlus,
  Trophy,
  UserX,
  Info,
} from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import type { ModalAction } from "./Index";

export function ActionBtn({
  label,
  sublabel,
  Icon,
  onClick,
  disabled,
  active,
  variant,
}: {
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  onClick: () => void;
  disabled: boolean;
  active: boolean;
  variant: "blue" | "amber" | "emerald" | "red";
}) 


{
  const V = {
    blue: {
      btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100",
      activeBg: "bg-blue-700",
      check: "text-blue-200",
    },
    amber: {
      btn: "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200",
      activeBg: "bg-amber-100",
      check: "text-amber-400",
    },
    emerald: {
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-100",
      activeBg: "bg-emerald-700",
      check: "text-emerald-200",
    },
    red: {
      btn: "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200",
      activeBg: "bg-red-100",
      check: "text-red-400",
    },
  }[variant];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        ${active ? V.activeBg : V.btn}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <div className="flex-1 text-left">
        <p className="leading-none">{label}</p>
        <p className="text-[10px] font-normal mt-0.5 opacity-70">{sublabel}</p>
      </div>
      {active ? (
        <CheckCircle className={`w-4 h-4 shrink-0 ${V.check}`} />
      ) : (
        !disabled && (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
        )
      )}
    </button>
  );
}

export function RecruiterActionsPanel({
  status,
  statusLoading,
  isClosed,
  isRejected,
  onAction,
}: {
  status: string | undefined;
  statusLoading: boolean;
  isClosed: boolean;
  isRejected: boolean;
  isWithdrawn: boolean;
  onAction: (action: ModalAction) => void;
})

{
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Recruiter Actions</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Move candidate through the pipeline
        </p>
      </div>
      <div className="p-4 space-y-2">
        <ActionBtn
          label="Shortlist Candidate"
          sublabel="Move to shortlist stage"
          Icon={UserCheck}
          variant="blue"
          active={status === ApplicationStatus.SHORTLISTED}
          disabled={
            statusLoading ||
            isClosed ||
            status === ApplicationStatus.SHORTLISTED
          }
          onClick={() => onAction("shortlist")}
        />
        <ActionBtn
          label="Schedule Interview"
          sublabel="Mark interview as scheduled"
          Icon={CalendarPlus}
          variant="amber"
          active={status === ApplicationStatus.INTERVIEW_SCHEDULED}
          disabled={
            statusLoading ||
            isClosed ||
            status === ApplicationStatus.INTERVIEW_SCHEDULED
          }
          onClick={() => onAction("interview")}
        />
        <ActionBtn
          label="Mark as Selected"
          sublabel="Choose this candidate for the role"
          Icon={Trophy}
          variant="emerald"
          active={status === ApplicationStatus.SELECTED}
          disabled={
            statusLoading || isClosed || status === ApplicationStatus.SELECTED
          }
          onClick={() => onAction("select")}
        />

        <div className="pt-1">
          <div className="border-t border-slate-100 mb-2" />
          <ActionBtn
            label="Reject Candidate"
            sublabel="Remove from consideration"
            Icon={UserX}
            variant="red"
            active={isRejected}
            disabled={statusLoading || isClosed}
            onClick={() => onAction("reject")}
          />
        </div>

        {isClosed && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">
              This application is {isRejected ? "rejected" : "withdrawn"} and no
              further actions can be taken.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
