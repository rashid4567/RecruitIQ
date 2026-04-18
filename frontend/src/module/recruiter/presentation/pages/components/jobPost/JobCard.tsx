import { MapPin, Clock, MoreVertical } from "lucide-react";
import type { JobCardProps } from "../../../types/jobCard.types"; 

const statusConfig = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Paused: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Expired: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Draft: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
};

export default function JobCard({ 
  job, 
  onViewClick 
}: { 
  job: JobCardProps; 
  onViewClick: (job: JobCardProps) => void;
}) {
  const status = statusConfig[job.status];

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
          {job.category}
        </span>
        <span className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {job.status}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {job.title}
      </h3>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{job.jobType}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{job.applications}</p>
          <p className="text-xs text-gray-500">Applications</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{job.shortlisted}</p>
          <p className="text-xs text-gray-500">Shortlisted</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {job.avgAiScore}%
          </p>
          <p className="text-xs text-gray-500">AI Score</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewClick(job)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
        >
          Quick View
        </button>
        <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}