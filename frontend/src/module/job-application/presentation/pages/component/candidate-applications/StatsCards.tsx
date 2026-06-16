import React from "react";
import {
  FileText,
  Calendar,
  CheckCircle2,
  Timer,
  ArrowUpRight,
} from "lucide-react";
import {
  ApplicationStatus,
  type JobApplication,
} from "../../../../domain/entity/job-application.entity";

interface Props {
  apps: JobApplication[];
}

export const StatsCards: React.FC<Props> = ({ apps }) => {
  const stats = [
    {
      label: "Total Applications",
      value: apps.length,
      sub: "All time",
      icon: FileText,
      accentText: "text-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      border: "border-blue-100",
      glow: "shadow-blue-50",
    },
    {
      label: "In Progress",
      value: apps.filter(
        (a) =>
          a.getStatus() === ApplicationStatus.APPLIED ||
          a.getStatus() === ApplicationStatus.SHORTLISTED,
      ).length,
      sub: "Applied & shortlisted",
      icon: Timer,
      accentText: "text-amber-600",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      border: "border-amber-100",
      glow: "shadow-amber-50",
    },
    {
      label: "Interviews",
      value: apps.filter(
        (a) => a.getStatus() === ApplicationStatus.INTERVIEW_SCHEDULED,
      ).length,
      sub: "Upcoming",
      icon: Calendar,
      accentText: "text-violet-600",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      border: "border-violet-100",
      glow: "shadow-violet-50",
    },
    {
      label: "Offers Received",
      value: apps.filter((a) => a.getStatus() === ApplicationStatus.SELECTED)
        .length,
      sub: "Congratulations!",
      icon: CheckCircle2,
      accentText: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      border: "border-emerald-100",
      glow: "shadow-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl border ${s.border} p-5 shadow-sm ${s.glow} hover:shadow-md transition-shadow duration-200 group`}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center`}
            >
              <s.icon size={18} className={s.iconColor} />
            </div>
            <ArrowUpRight
              size={14}
              className="text-slate-200 group-hover:text-slate-400 transition-colors"
            />
          </div>
          <p
            className={`text-3xl font-black ${s.accentText} leading-none mb-1.5`}
          >
            {s.value}
          </p>
          <p className="text-[12px] font-semibold text-slate-600">{s.label}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
};
