'use client';

import React from 'react';
import { Clock, MapPin, Video, FileDown, CalendarX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type JobApplication, ApplicationStatus } from '../../../../domain/entity/job-application.entity';
import { STATUS_CFG, formatDate, timeAgo, formatInterview } from './Helpers';
import { ActionsMenu } from './Actionsmenu';

interface Props {
  app: JobApplication;
  onWithdraw: (app: JobApplication) => void;
  index: number;
}

const JobAvatar: React.FC<{ jobId: string }> = ({ jobId }) => {
  const colors = [
    'from-blue-400 to-indigo-500',
    'from-teal-400 to-cyan-500',
    'from-violet-400 to-purple-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-green-500',
  ];
  const idx = jobId.charCodeAt(0) % colors.length;
  return (
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-[11px] font-black shadow-sm shrink-0`}
    >
      {jobId.slice(0, 2).toUpperCase()}
    </div>
  );
};

const StatusPill: React.FC<{ status: ApplicationStatus; rejectionReason?: string }> = ({
  status,
  rejectionReason,
}) => {
  const cfg = STATUS_CFG[status];
  return (
    <div>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.pill} ${cfg.text} whitespace-nowrap`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
        {cfg.label}
      </span>
      {rejectionReason && (
        <p
          className="text-[10px] text-red-400 mt-1 max-w-[150px] truncate italic"
          title={rejectionReason}
        >
          {rejectionReason}
        </p>
      )}
    </div>
  );
};

const InterviewCell: React.FC<{ app: JobApplication }> = ({ app }) => {
  const interview = app.getInterview();
  if (!interview) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
        <CalendarX size={13} />
        Not scheduled
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
        <Clock size={11} className="text-blue-400 shrink-0" />
        {formatInterview(interview.scheduledAt)}
      </div>
      {interview.location && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <MapPin size={10} className="shrink-0" />
          {interview.location}
        </div>
      )}
      {interview.notes && (
        <p className="text-[10px] text-slate-400 italic truncate max-w-[160px]">
          {interview.notes}
        </p>
      )}
      {interview.meetingLink && (
        <a
          href={interview.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // prevent row click from firing
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition shadow-sm shadow-blue-200"
        >
          <Video size={11} />
          Join Meeting
        </a>
      )}
    </div>
  );
};

export const ApplicationRow: React.FC<Props> = ({ app, onWithdraw, index }) => {
  const navigate = useNavigate();
  const status = app.getStatus();
  const isWithdrawn = status === ApplicationStatus.WITHDRAWN;

const handleRowClick = () => {
  navigate(`/candidate/applications/${app.getId()}`);
};

  return (
    <tr
      onClick={handleRowClick}
      className={`group border-b border-slate-50 last:border-0 transition-colors hover:bg-blue-50/20 cursor-pointer ${
        isWithdrawn ? 'opacity-50' : ''
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Company & Job */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <JobAvatar jobId={app.getJobId()} />
          <div>
            <p className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
              {app.getJobId()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
              #{app.getId().slice(0, 8)}
            </p>
          </div>
        </div>
      </td>

      {/* Applied Date */}
      <td className="px-5 py-4 whitespace-nowrap">
        <p className="text-[13px] font-medium text-slate-700">{formatDate(app.getAppliedAt())}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(app.getAppliedAt())}</p>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusPill status={status} rejectionReason={app.getRejectionReason()} />
      </td>

      {/* Interview */}
      <td className="px-5 py-4 min-w-[190px]">
        <InterviewCell app={app} />
      </td>

      {/* Resume */}
      <td className="px-5 py-4">
        <button
          onClick={(e) => e.stopPropagation()} // prevent row click
          className="flex items-center gap-1.5 text-[12px] text-blue-500 hover:text-blue-700 font-semibold transition-colors group/dl"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center group-hover/dl:bg-blue-100 transition-colors">
            <FileDown size={13} className="group-hover/dl:translate-y-0.5 transition-transform text-blue-500" />
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            {app.getResumeId().slice(0, 12)}…
          </span>
        </button>
      </td>

      {/* Actions */}
      <td
        className="px-4 py-4"
        onClick={(e) => e.stopPropagation()} // prevent row click when opening menu
      >
        <ActionsMenu app={app} onWithdraw={onWithdraw} />
      </td>
    </tr>
  );
};