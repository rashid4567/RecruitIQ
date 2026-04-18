import { MapPin } from "lucide-react";
import type { JobCardProps } from "../../../types/jobCard.types";


const statusConfig = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Paused: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Expired: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Draft: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
};

export default function JobListRow({ 
  job, 
  onViewClick 
}: { 
  job: JobCardProps; 
  onViewClick: (job: JobCardProps) => void;
}) {
  const status = statusConfig[job.status];

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-5 px-6">
        <div>
          <p
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
            onClick={() => onViewClick(job)}
          >
            {job.title}
          </p>
          <p className="text-sm text-gray-500">{job.category}</p>
        </div>
      </td>
      <td className="py-5 px-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          {job.location}
        </div>
      </td>
      <td className="py-5 px-6">
        <span className="text-sm font-medium text-gray-900">{job.applications}</span>
      </td>
      <td className="py-5 px-6">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${job.avgAiScore}%` }} />
          </div>
          <span className="text-sm font-medium text-gray-900">{job.avgAiScore}%</span>
        </div>
      </td>
      <td className="py-5 px-6">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 w-fit ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {job.status}
        </span>
      </td>
      <td className="py-5 px-6">
        <button
          onClick={() => onViewClick(job)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View
        </button>
      </td>
    </tr>
  );
}