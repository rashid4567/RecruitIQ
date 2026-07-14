import { useState } from "react";
import { Calendar, Clock, Video, ExternalLink, MapPin, Copy, Check as CheckIcon } from "lucide-react";
import { formatDate } from "./Formatters";

interface Interview {
  scheduledAt: string | Date;
  location?: string;
  notes?: string;
  meetingLink?: string;
}

interface InterviewCardProps {
  interview: Interview;
}

function relativeDayLabel(date: Date): string {
  const today = new Date();
  const target = new Date(date);
  const diffDays = Math.round(
    (new Date(target.toDateString()).getTime() - new Date(today.toDateString()).getTime()) / 86400000
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 6) return target.toLocaleDateString("en-IN", { weekday: "long" });
  return target.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const [copied, setCopied] = useState(false);
  const scheduledDate = new Date(interview.scheduledAt);
  const timeLabel = scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const handleCopyLink = async () => {
    if (!interview.meetingLink) return;
    try {
      await navigator.clipboard.writeText(interview.meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch(err : unknown) {
       const message = err instanceof Error ? err.message : "Facing issue to copy the link";
       throw new Error(message);
    }
  };

  return (
    <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200/40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          Interview details
        </h2>
        <span className="text-[11px] font-bold uppercase tracking-wide bg-white/15 px-2.5 py-1 rounded-full">
          {relativeDayLabel(scheduledDate)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white/10 hover:bg-white/15 rounded-xl p-3.5 transition-colors">
          <p className="text-blue-200 text-[11px] font-medium mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Date
          </p>
          <p className="text-white font-semibold text-sm">{formatDate(interview.scheduledAt)}</p>
        </div>
        <div className="bg-white/10 hover:bg-white/15 rounded-xl p-3.5 transition-colors">
          <p className="text-blue-200 text-[11px] font-medium mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Time
          </p>
          <p className="text-white font-semibold text-sm">{timeLabel}</p>
        </div>
        {interview.location && (
          <div className="bg-white/10 hover:bg-white/15 rounded-xl p-3.5 transition-colors">
            <p className="text-blue-200 text-[11px] font-medium mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location
            </p>
            <p className="text-white font-semibold text-sm">{interview.location}</p>
          </div>
        )}
      </div>

      {interview.notes && (
        <div className="bg-white/10 rounded-xl p-3.5 mb-4">
          <p className="text-blue-200 text-[11px] font-medium mb-1">Recruiter notes</p>
          <p className="text-white/90 text-sm leading-relaxed">{interview.notes}</p>
        </div>
      )}

      {interview.meetingLink && (
        <div className="flex items-center gap-2">
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all shadow-sm"
          >
            <Video className="w-4 h-4" />
            Join meeting
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-3 py-2.5 rounded-xl transition-colors"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}