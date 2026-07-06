import { Calendar, Clock, Hourglass, Video, MapPin, Building2 } from "lucide-react";
import type { GetCandidateInterviewDetailsResponse } from "@/module/interview/types/candidateInterview.types";
import {
  formatDateLabel,
  formatTime,
  formatDuration,
} from "./Interviewdetails.helpers";

interface ScheduleSummaryCardsProps {
  details: GetCandidateInterviewDetailsResponse;
  isOnline: boolean;
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-500 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ScheduleSummaryCards({
  details,
  isOnline,
}: ScheduleSummaryCardsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
        Interview details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SummaryTile
          icon={<Calendar size={15} />}
          label="Date"
          value={formatDateLabel(details.scheduledAt)}
        />
        <SummaryTile
          icon={<Clock size={15} />}
          label="Time"
          value={formatTime(details.scheduledAt)}
        />
        <SummaryTile
          icon={<Hourglass size={15} />}
          label="Duration"
          value={formatDuration(details.durationInMinutes)}
        />
        <SummaryTile
          icon={isOnline ? <Video size={15} /> : <MapPin size={15} />}
          label="Format"
          value={isOnline ? "Online" : details.location || "In-person"}
        />
        {!isOnline && details.roomId && (
          <SummaryTile
            icon={<Building2 size={15} />}
            label="Room"
            value={details.roomId}
          />
        )}
      </div>
    </div>
  );
}