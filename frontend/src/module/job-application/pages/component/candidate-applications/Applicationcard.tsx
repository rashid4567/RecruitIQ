import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Video,
  FileText,
  Download,
  CalendarX,
  Hash,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import { STATUS_CFG, formatDate, timeAgo, formatInterview } from "./Helpers";
import { ActionsMenu } from "./Actionsmenu";
import type { CandidateApplication } from "@/module/job-application/types/application.types";

interface Props {
  app: CandidateApplication;
  onWithdraw: (app: CandidateApplication) => void;
  index: number;
}

const AVATAR_COLORS = [
  "from-blue-400 to-indigo-500",
  "from-teal-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-green-500",
];

/**
 * Mobile equivalent of ApplicationRow. Rendered instead of the <table> below
 * the md breakpoint (see ApplicationsTable) so nothing scrolls horizontally
 * on a phone.
 */
export const ApplicationCard: React.FC<Props> = ({
  app,
  onWithdraw,
  index,
}) => {
  const navigate = useNavigate();
  const [interviewExpanded, setInterviewExpanded] = useState(false);

  const status = app.status;
  const isWithdrawn = status === ApplicationStatus.WITHDRAWN;
  const cfg = STATUS_CFG[status];
  const interview = app.interview;

  const companyName =
    (app as { companyName?: string }).companyName ?? app.jobTitle ?? app.jobId;
  const logoUrl = (app as { companyLogoUrl?: string }).companyLogoUrl;
  const avatarIdx = companyName.charCodeAt(0) % AVATAR_COLORS.length;

  const handleClick = () => {
    navigate(`/candidate/applications/${app.applicationId}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 active:scale-[0.99] transition-transform animate-in fade-in slide-in-from-bottom-1 ${
        isWithdrawn ? "opacity-50" : ""
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Company + role header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-100"
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-xl bg-linear-to-br ${AVATAR_COLORS[avatarIdx]} flex items-center justify-center text-white text-[13px] font-black shadow-sm shrink-0`}
            >
              {companyName.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-[14px] font-bold text-slate-800 truncate">
              {companyName}
            </p>
            <p className="text-[13px] font-medium text-slate-500 truncate">
              {app.jobTitle}
            </p>
            <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-500 text-[10px] font-bold font-mono">
              <Hash size={9} className="shrink-0" />
              {app.applicationNumber}
            </span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <ActionsMenu app={app} onWithdraw={onWithdraw} />
        </div>
      </div>

      {/* Applied + status row */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">
            Applied
          </p>
          <p className="text-[12px] font-medium text-slate-600 mt-0.5">
            {formatDate(app.appliedAt)} · {timeAgo(app.appliedAt)}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.pill} ${cfg.text} whitespace-nowrap`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
          {cfg.label}
        </span>
      </div>

      {app.rejectionReason && (
        <p className="text-[11px] text-red-400 italic border-t border-slate-50 pt-3">
          {app.rejectionReason}
        </p>
      )}

    
      <div className="border-t border-slate-50 pt-3">
        {interview ? (
          <div className="space-y-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInterviewExpanded((p) => !p);
              }}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700"
            >
              <Clock size={12} className="text-blue-400 shrink-0" />
              Interview: {formatInterview(interview.scheduledAt)}
              {(interview.location || interview.notes) && (
                <ChevronDown
                  size={12}
                  className={`text-slate-300 transition-transform ${
                    interviewExpanded ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {interviewExpanded && (
              <div className="space-y-1 pl-4.75">
                {interview.location && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <MapPin size={10} className="shrink-0" />
                    {interview.location}
                  </div>
                )}
                {interview.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    {interview.notes}
                  </p>
                )}
              </div>
            )}

            {interview.meetingLink ? (
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition"
              >
                <Video size={11} />
                Join Interview
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 text-[11px] font-medium rounded-xl border border-slate-200">
                <Clock size={11} />
                Link not available
              </div>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-400">
            <CalendarX size={12} className="text-slate-300 shrink-0" />
            Not scheduled
          </div>
        )}
      </div>

      {/* Resume */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-2.5 w-full border-t border-slate-50 pt-3 group/dl"
      >
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover/dl:bg-blue-100 transition-colors shrink-0">
          <FileText size={15} className="text-blue-500" />
        </div>
        <div className="text-left min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-slate-700 truncate">
            {app.appliedResumeFileName ?? "Resume"}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold">
            <Download size={10} />
            Download
          </div>
        </div>
      </button>
    </div>
  );
};