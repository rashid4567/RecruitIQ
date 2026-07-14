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

import {
  ApplicationStatus,
} from "@/module/job-application/types/jobApplication.types";

import {
  STATUS_CFG,
  formatDate,
  timeAgo,
  formatInterview,
} from "./Helpers";

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
 * NOTE: this assumes `CandidateApplication` exposes a `companyName` (and
 * optionally `companyLogoUrl`) field. If your type only has `jobId`/`jobTitle`
 * today, add `companyName` (and `companyLogoUrl?`) to that type and to
 * whatever maps the API response onto it — the review's #2 and #3 both
 * depend on the company actually being available on the row data.
 */
const CompanyAvatar: React.FC<{ companyName: string; logoUrl?: string }> = ({
  companyName,
  logoUrl,
}) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={companyName}
        className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-100"
      />
    );
  }

  const idx = companyName.charCodeAt(0) % AVATAR_COLORS.length;

  return (
    <div
      className={`w-11 h-11 rounded-xl bg-linear-to-br ${AVATAR_COLORS[idx]} flex items-center justify-center text-white text-[13px] font-black shadow-sm shrink-0`}
    >
      {companyName.slice(0, 1).toUpperCase()}
    </div>
  );
};

const StatusPill: React.FC<{
  status: ApplicationStatus;
  rejectionReason?: string;
  interviewDate?: string;
}> = ({ status, rejectionReason, interviewDate }) => {
  const cfg = STATUS_CFG[status];

  // Extra context under the pill, per review item #4 — "Selected" alone
  // doesn't tell the candidate anything they don't already know.
  const context =
    status === ApplicationStatus.SELECTED
      ? "Offer sent"
      : status === ApplicationStatus.INTERVIEW_SCHEDULED && interviewDate
        ? formatInterview(interviewDate)
        : undefined;

  return (
    <div>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.pill} ${cfg.text} whitespace-nowrap`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
        {cfg.label}
      </span>

      {context && (
        <p className="text-[10px] text-slate-400 mt-1 font-medium">
          {context}
        </p>
      )}

      {rejectionReason && (
        <p
          className="text-[10px] text-red-400 mt-1 max-w-37.5 truncate italic"
          title={rejectionReason}
        >
          {rejectionReason}
        </p>
      )}
    </div>
  );
};

const InterviewCell: React.FC<{ app: CandidateApplication }> = ({ app }) => {
  const [expanded, setExpanded] = useState(false);
  const interview = app.interview;

  if (!interview) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-400">
        <CalendarX size={12} className="text-slate-300 shrink-0" />
        Not scheduled
      </div>
    );
  }

  // Collapsed by default — only the essentials (when + join). Location and
  // notes are one click away instead of always taking up row height.
  return (
    <div className="space-y-1.5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((p) => !p);
        }}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700"
      >
        <Clock size={11} className="text-blue-400 shrink-0" />
        {formatInterview(interview.scheduledAt)}
        {(interview.location || interview.notes) && (
          <ChevronDown
            size={12}
            className={`text-slate-300 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {expanded && (
        <div className="space-y-1 pl-4.75">
          {interview.location && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <MapPin size={10} className="shrink-0" />
              {interview.location}
            </div>
          )}

          {interview.notes && (
            <p className="text-[10px] text-slate-400 italic truncate max-w-40">
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition shadow-sm shadow-emerald-200"
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
  );
};

// Resume rendered as a small document card rather than a bare filename,
// with an optional size line when the data is available.
const ResumeCell: React.FC<{ app: CandidateApplication }> = ({ app }) => {
  const fileName = app.appliedResumeFileName;
  const fileSize = (app as { appliedResumeFileSize?: string })
    .appliedResumeFileSize;

  return (
    <button
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2.5 group/dl"
    >
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover/dl:bg-blue-100 transition-colors shrink-0">
        <FileText size={15} className="text-blue-500" />
      </div>

      <div className="text-left min-w-0">
        <p className="text-[12px] font-semibold text-slate-700 truncate max-w-30">
          {fileName ? fileName : "Resume"}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold group-hover/dl:text-blue-700 transition-colors">
          <Download
            size={10}
            className="group-hover/dl:translate-y-0.5 transition-transform"
          />
          {fileSize ? fileSize : "Download"}
        </div>
      </div>
    </button>
  );
};

export const ApplicationRow: React.FC<Props> = ({
  app,
  onWithdraw,
  index,
}) => {
  const navigate = useNavigate();

  const status = app.status;
  const isWithdrawn = status === ApplicationStatus.WITHDRAWN;
  // See note on CompanyAvatar above re: companyName being required on the type.
  const companyName =
    (app as { companyName?: string }).companyName ?? app.jobTitle ?? app.jobId;

  const handleRowClick = () => {
    navigate(`/candidate/applications/${app.applicationId}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className={`group border-b border-slate-50 last:border-0 transition-all duration-150 hover:shadow-sm hover:bg-blue-50/20 hover:-translate-y-px cursor-pointer animate-in fade-in slide-in-from-bottom-1 ${
        isWithdrawn ? "opacity-50" : ""
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <CompanyAvatar companyName={companyName} />

          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800 leading-snug truncate">
              {companyName}
            </p>
            <p className="text-[12px] font-medium text-slate-500 leading-snug truncate group-hover:text-blue-600 transition-colors">
              {app.jobTitle}
            </p>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-500 text-[10px] font-bold font-mono">
                <Hash size={9} className="shrink-0" />
                {app.applicationNumber}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-5 whitespace-nowrap">
        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">
          Applied
        </p>
        <p className="text-[13px] font-medium text-slate-700 mt-0.5">
          {formatDate(app.appliedAt)}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {timeAgo(app.appliedAt)}
        </p>
      </td>

      <td className="px-5 py-5">
        <StatusPill
          status={status}
          rejectionReason={app.rejectionReason}
          interviewDate={app.interview?.scheduledAt}
        />
      </td>

      <td className="px-5 py-5">
        <InterviewCell app={app} />
      </td>

      <td className="px-5 py-5">
        <ResumeCell app={app} />
      </td>

      <td
        className="px-4 py-5"
        onClick={(e) => e.stopPropagation()}
      >
        <ActionsMenu
          app={app}
          onWithdraw={onWithdraw}
        />
      </td>
    </tr>
  );
};