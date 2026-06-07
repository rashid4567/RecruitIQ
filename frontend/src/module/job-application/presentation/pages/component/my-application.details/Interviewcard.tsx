import { Calendar, Video, ExternalLink, MapPin } from "lucide-react";
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

export function InterviewCard({ interview }: InterviewCardProps) {
  return (
    <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200/40">
      <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
          <Calendar className="w-3.5 h-3.5" />
        </div>
        Interview details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 hover:bg-white/15 rounded-xl p-3.5 transition-colors">
          <p className="text-blue-200 text-[11px] font-medium mb-1">Date & time</p>
          <p className="text-white font-semibold text-sm">
            {formatDate(interview.scheduledAt)}
          </p>
        </div>
        {interview.location && (
          <div className="bg-white/10 hover:bg-white/15 rounded-xl p-3.5 transition-colors">
            <p className="text-blue-200 text-[11px] font-medium mb-1">Location</p>
            <p className="text-white font-semibold text-sm flex items-center gap-1.5">
              <MapPin className="w-3 h-3 opacity-70" />
              {interview.location}
            </p>
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
      )}
    </div>
  );
}