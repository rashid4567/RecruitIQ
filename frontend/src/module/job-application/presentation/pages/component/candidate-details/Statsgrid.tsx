import { DollarSign, Clock, Users, Calendar } from "lucide-react";
import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import { formatDateShort, formatSalary } from "./Formatters";

interface StatsGridProps {
  job: Job;
}

export function StatsGrid({ job }: StatsGridProps) {
  const stats = [
    {
      icon: <DollarSign className="w-3.5 h-3.5" />,
      label: "Salary",
      value: formatSalary(job.salary.min, job.salary.max, job.salary.currency),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "Experience",
      value: `${job.experienceMin}–${job.experienceMax} yrs`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: <Users className="w-3.5 h-3.5" />,
      label: "Openings",
      value: `${job.positions} position${job.positions !== 1 ? "s" : ""}`,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: <Calendar className="w-3.5 h-3.5" />,
      label: "Posted",
      value: formatDateShort(job.postedOn),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map(({ icon, label, value, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm hover:border-slate-200 transition-colors"
        >
          <div className={`w-6 h-6 rounded-lg ${bg} ${color} flex items-center justify-center mb-2`}>
            {icon}
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">
            {label}
          </p>
          <p className="text-xs font-semibold text-slate-800 leading-snug">{value}</p>
        </div>
      ))}
    </div>
  );
}