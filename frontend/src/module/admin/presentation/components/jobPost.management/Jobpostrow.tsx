import {
  Briefcase,
  MapPin,
  Eye,
  DollarSign,
  Clock,
  MoreVertical,
  Ban,
  CheckCircle,
  Globe,
  Users,
  Zap,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  JobPostEntity,
  JobStatus,
  JobType,
} from "../../../domain/entities/jobpost.entity";
import {
  formatDate,
  formatSalary,
  locationLabel,
  expRange,
} from "../../utils/jobPostRow.utils";

export function StatusBadge({
  status,
  isBlocked,
}: {
  status: JobStatus;
  isBlocked: boolean;
}) {
  if (isBlocked) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200 ring-1 ring-red-100">
        <Ban className="w-3 h-3" /> Blocked
      </span>
    );
  }
  const cfg: Record<JobStatus, { cls: string; dot?: string; label: string }> = {
    active: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      dot: "bg-emerald-500",
      label: "Active",
    },
    draft: {
      cls: "bg-sky-50 text-sky-700 border-sky-200 ring-sky-100",
      label: "Draft",
    },
    expired: {
      cls: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
      label: "Expired",
    },
  };
  const c = cfg[status] ?? cfg.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ring-1",
        c.cls,
      )}
    >
      {c.dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", c.dot)} />
      )}
      {c.label}
    </span>
  );
}

export function TypeBadge({
  jobType,
  isRemote,
}: {
  jobType: JobType;
  isRemote: boolean;
}) {
  const typeStyles: Record<JobType, string> = {
    "full-time": "bg-violet-50 text-violet-700 border-violet-200",
    "part-time": "bg-orange-50 text-orange-700 border-orange-200",
    contract: "bg-pink-50 text-pink-700 border-pink-200",
    internship: "bg-teal-50 text-teal-700 border-teal-200",
  };
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border capitalize w-fit",
          typeStyles[jobType],
        )}
      >
        {jobType.replace("-", " ")}
      </span>
      {isRemote && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 w-fit">
          <Globe className="w-3 h-3" /> Remote
        </span>
      )}
    </div>
  );
}

export function SkillBadges({
  skills,
  max = 3,
}: {
  skills: string[];
  max?: number;
}) {
  const visible = skills.slice(0, max);
  const remaining = skills.length - max;
  return (
    <div className="flex flex-wrap items-center gap-1 mt-2">
      {visible.map((skill) => (
        <span
          key={skill}
          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 text-white tracking-wide"
        >
          {skill}
        </span>
      ))}
      {remaining > 0 && (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

export function ApplicationsBar({ count }: { count: number }) {
  const pct = Math.min((count / 100) * 100, 100);
  const color =
    pct < 30
      ? "from-emerald-400 to-emerald-500"
      : pct < 70
        ? "from-amber-400 to-amber-500"
        : "from-red-400 to-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900 tabular-nums">
          {count}
        </span>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          applicants
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-linear-to-r transition-all duration-500",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface JobPostRowProps {
  job: JobPostEntity;
  onView: (job: JobPostEntity) => void;
  onToggleBlock: (job: JobPostEntity) => void;
  isPending?: boolean;
}

export function JobPostRow({
  job,
  onView,
  onToggleBlock,
  isPending,
}: JobPostRowProps) {
  return (
    <tr
      className={cn(
        "group relative border-b border-slate-100 last:border-b-0 transition-all duration-150",
        "hover:bg-linear-to-r hover:from-slate-50/80 hover:to-indigo-50/30",
        isPending && "opacity-50 pointer-events-none select-none",
      )}
    >
      <td className="px-6 py-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-r-full" />
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div
              className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm",
                "bg-linear-to-br from-slate-100 to-slate-50 border border-slate-200 text-slate-500",
                "group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-indigo-200",
              )}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            {job.isBlocked && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <Ban className="w-2 h-2 text-white" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <button
              onClick={() => onView(job)}
              className="font-semibold text-slate-900 text-[14px] truncate max-w-65 text-left block hover:text-indigo-700 transition-colors leading-snug"
            >
              {job.title}
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3 h-3 text-slate-400" />
              <p className="text-xs text-slate-500 font-medium">
                {job.department}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                <MapPin className="w-3 h-3 text-slate-400" />
                {locationLabel(job.location, job.isRemote)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                <Eye className="w-3 h-3 text-slate-400" />
                {job.views.toLocaleString()} views
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                <DollarSign className="w-3 h-3 text-slate-400" />
                {formatSalary(job.salary)}
              </span>
            </div>
            {job.requiredSkills.length > 0 && (
              <SkillBadges skills={job.requiredSkills} max={3} />
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="space-y-2">
          <TypeBadge jobType={job.jobType} isRemote={job.isRemote} />
          <div className="flex flex-col gap-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-slate-400" />
              {expRange(job.experienceMin, job.experienceMax)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              {job.positions} position{job.positions > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={job.status} isBlocked={job.isBlocked} />
      </td>

      <td className="px-5 py-4 min-w-35">
        <ApplicationsBar count={job.applicationsCount} />
      </td>

      <td className="px-4 py-4 text-center">
        <Switch
          checked={!job.isBlocked && job.status === "active"}
          onCheckedChange={() => onToggleBlock(job)}
          disabled={job.status !== "active"}
          className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-slate-200"
        />
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">
          {formatDate(job.postedOn)}
        </p>
        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" /> Exp: {formatDate(job.expiresAt)}
        </p>
      </td>

      <td className="px-6 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl shadow-xl border-slate-200 p-1.5"
          >
            <DropdownMenuItem
              onClick={() => onView(job)}
              className="gap-2.5 cursor-pointer rounded-xl py-2.5 px-3 focus:bg-slate-50 text-slate-700"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-sm">View Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5 bg-slate-100" />
            <DropdownMenuItem
              onClick={() => onToggleBlock(job)}
              className={cn(
                "gap-2.5 cursor-pointer rounded-xl py-2.5 px-3",
                job.isBlocked
                  ? "text-emerald-700 focus:bg-emerald-50"
                  : "text-red-600 focus:bg-red-50",
              )}
            >
              {job.isBlocked ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">Unblock Job</span>
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4" />
                  <span className="font-medium text-sm">Block Job</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 last:border-b-0">
      <td className="px-6 py-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 pt-0.5">
            <div className="h-4 w-52 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-3 w-28 bg-slate-100 rounded-md animate-pulse" />
            <div className="flex gap-2 pt-0.5">
              <div className="h-5 w-24 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-5 w-16 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-5 w-28 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <div className="flex gap-1.5 pt-0.5">
              <div className="h-4 w-14 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-4 w-18 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-4 w-12 bg-slate-100 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="space-y-2">
          <div className="h-5 w-20 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-14 bg-slate-100 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-4 w-6 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full animate-pulse" />
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="h-6 w-10 bg-slate-100 rounded-full animate-pulse mx-auto" />
      </td>
      <td className="px-5 py-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-8 w-8 bg-slate-100 rounded-xl animate-pulse ml-auto" />
      </td>
    </tr>
  );
}
