import React, { useEffect, useState } from "react";
import { FileText, Timer, Calendar, CheckCircle2 } from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import type { CandidateApplication } from "@/module/job-application/types/application.types";

interface Props {
  apps: CandidateApplication[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const isWithinDays = (iso: string | undefined, days: number) => {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() <= days * DAY_MS;
};

// Simple count-up so numbers don't just pop in — review item #13.
const useCountUp = (target: number, durationMs = 600) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
};

const StatCard: React.FC<{
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  topBorder: string;
  hoverBorder: string;
}> = ({ label, value, sub, icon: Icon, iconBg, iconColor, topBorder, hoverBorder }) => {
  const animated = useCountUp(value);

  return (
    <div
      className={`h-full bg-linear-to-b from-white to-slate-50 rounded-2xl xl:rounded-3xl border border-slate-200 border-t-4 ${topBorder} p-6 xl:p-7 shadow hover:shadow-xl hover:-translate-y-1 hover:${hoverBorder} transition-all duration-300`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}
      >
        <Icon size={22} strokeWidth={2} className={iconColor} />
      </div>

      <p className="text-3xl lg:text-4xl font-black text-slate-800 leading-none mb-1.5 tabular-nums">
        {animated}
      </p>
      <p className="text-[13px] font-semibold text-slate-600">{label}</p>
      <p className="text-[12px] text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
};

export const StatsCards: React.FC<Props> = ({ apps }) => {
  const inProgress = apps.filter(
    (a) =>
      a.status === ApplicationStatus.APPLIED ||
      a.status === ApplicationStatus.SHORTLISTED,
  );

  const interviews = apps.filter(
    (a) => a.status === ApplicationStatus.INTERVIEW_SCHEDULED,
  );

  const offers = apps.filter((a) => a.status === ApplicationStatus.SELECTED);

  const appliedThisMonth = apps.filter((a) =>
    isWithinDays(a.appliedAt, 30),
  ).length;

  const interviewsThisWeek = interviews.filter((a) =>
    isWithinDays(a.interview?.scheduledAt, 7),
  ).length;

  if (apps.length === 0) {
    return (
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-linear-to-b from-white to-slate-50 rounded-2xl xl:rounded-3xl border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <FileText size={22} className="text-blue-500" />
          </div>
          <p className="text-[14px] font-bold text-slate-600">
            No applications yet
          </p>
          <p className="text-[12px] text-slate-400 mt-1">
            Your stats will show up here once you apply to your first job.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Applications",
      value: apps.length,
      sub:
        appliedThisMonth > 0
          ? `${appliedThisMonth} this month`
          : "Updated just now",
      icon: FileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      topBorder: "border-t-blue-500",
      hoverBorder: "border-t-blue-600",
    },
    {
      label: "In Progress",
      value: inProgress.length,
      sub: `${inProgress.length} active`,
      icon: Timer,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      topBorder: "border-t-amber-500",
      hoverBorder: "border-t-amber-600",
    },
    {
      label: "Interviews",
      value: interviews.length,
      sub:
        interviewsThisWeek > 0
          ? `${interviewsThisWeek} this week`
          : "None upcoming",
      icon: Calendar,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      topBorder: "border-t-violet-500",
      hoverBorder: "border-t-violet-600",
    },
    {
      label: "Offers Received",
      value: offers.length,
      sub: offers.length > 0 ? `${offers.length} accepted` : "None yet",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      topBorder: "border-t-emerald-500",
      hoverBorder: "border-t-emerald-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
};