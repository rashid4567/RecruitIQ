import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { JobStatus, JobType } from "@/module/jobs/domain/dto/jobPost.dto";


interface StatusBadgeProps {
  status: JobStatus;
  isBlocked: boolean;
}

export function StatusBadge({ status, isBlocked }: StatusBadgeProps) {
  if (isBlocked)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border bg-rose-50 text-rose-600 border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        Blocked
      </span>
    );

  const cfg: Record<JobStatus, { cls: string; label: string; dot: string }> = {
    active: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Active",
      dot: "bg-emerald-500",
    },
    draft: {
      cls: "bg-slate-100 text-slate-600 border-slate-200",
      label: "Draft",
      dot: "bg-slate-400",
    },
    expired: {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Expired",
      dot: "bg-amber-500",
    },
  };

  const c = cfg[status] ?? cfg.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
        c.cls,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

interface TypeBadgeProps {
  jobType: JobType;
  isRemote: boolean;
}

export function TypeBadge({ jobType, isRemote }: TypeBadgeProps) {
  if (isRemote)
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
        Remote
      </span>
    );

  const cfg: Record<JobType, string> = {
    "full-time": "bg-blue-50 text-blue-700 border-blue-200",
    "part-time": "bg-orange-50 text-orange-700 border-orange-200",
    contract: "bg-purple-50 text-purple-700 border-purple-200",
    internship: "bg-pink-50 text-pink-700 border-pink-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 text-xs font-semibold rounded-lg border",
        cfg[jobType] ?? "bg-gray-50 text-gray-700 border-gray-200",
      )}
    >
      {jobType.charAt(0).toUpperCase() + jobType.slice(1)}
    </span>
  );
}

interface SkillBadgesProps {
  skills: string[];
  max?: number;
  variant?: "required" | "preferred";
}

export function SkillBadges({
  skills,
  max = 3,
  variant = "required",
}: SkillBadgesProps) {
  const shown = skills.slice(0, max);
  const rest = skills.length - max;

  const cls =
    variant === "required"
      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
      : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {shown.map((s, i) => (
        <Badge key={i} className={cn("text-xs rounded-md py-0.5", cls)}>
          {s}
        </Badge>
      ))}
      {rest > 0 && (
        <span className="text-xs text-slate-400 flex items-center">
          +{rest}
        </span>
      )}
    </div>
  );
}

export function ApplicationsBar({ count }: { count: number }) {
  const pct = Math.min((count / 100) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-slate-900 w-8 tabular-nums">
        {count}
      </span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
