import {
  Briefcase,
  User,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@/module/activity.logger/types/activity-log.types";
import {
  getUserName,
  getRole,
  getUserIdSafe,
  getDescription,
  getSeverity,
  formatRelativeTime,
} from "./Activitylog.helpers";
import { severityConfig } from "./Activitylog.config";

interface ActivityLogsCardProps {
  log: ActivityLog;
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

function avatarColor(str: string, isError: boolean) {
  if (isError) return "bg-rose-100 text-rose-700";
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function ActivityLogsCard({ log }: ActivityLogsCardProps) {
  const navigate = useNavigate();

  const action = log.action;
  const severity = getSeverity(action);
  const cfg = severityConfig[severity];
  const timestamp = log.timestamp;
  const metadata = log.metadata ?? {};
  const isError = severity === "error";

  const entityLabel =
    (metadata.title as string) ||
    (metadata.jobTitle as string) ||
    log.entityType ||
    "—";

  const name = getUserName(log);
  const initials = name.slice(0, 2).toUpperCase() || "?";
  const avColor = avatarColor(name, isError);

  const handleActorClick = () => {
    const uid = getUserIdSafe(log);
    if (!uid) return;
    const role = getRole(log);
    if (role.includes("candidate")) navigate(`/admin/candidates/${uid}`);
    else if (role.includes("recruiter") || role.includes("admin"))
      navigate(`/admin/recruiters/${uid}`);
  };

  const handleEntityClick = () => {
    const entityId = log.entityId;
    const entityType = log.entityType;
    if (!entityId || !entityType) return;
    switch (entityType.toUpperCase()) {
      case "JOB":
        navigate(`/admin/jobPosts`);
        break;
      case "USER":
        navigate(`/admin/users/${entityId}`);
        break;
      case "SUBSCRIPTION":
        navigate(`/admin/subscriptions/${entityId}`);
        break;
    }
  };

  const formatDate = (ts: string | number) =>
    new Date(ts).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (ts: string | number) =>
    new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm transition-colors",
        isError ? "border-rose-100 bg-rose-50/20" : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={handleActorClick}
          className="flex items-center gap-2.5 min-w-0 text-left"
        >
          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
              avColor,
            )}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-800 truncate">
              {name}
            </p>
            <p className="text-[11px] text-slate-400 capitalize">
              {getRole(log)}
            </p>
          </div>
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-48 p-1.5 rounded-xl shadow-lg border-slate-200"
          >
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                View full details
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                Copy event ID
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed mt-3">
        {getDescription(log)}
      </p>

      <button
        onClick={handleEntityClick}
        className="flex items-center gap-2 text-left mt-3 group/entity"
      >
        <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          {action.toUpperCase().includes("JOB") ? (
            <Briefcase className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
          ) : (
            <User className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
          )}
        </div>
        <span className="text-[13px] text-slate-600 truncate group-hover/entity:text-indigo-700 transition-colors">
          {entityLabel}
        </span>
      </button>

      <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
            cfg.badge,
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isError ? "bg-rose-500" : "bg-indigo-400",
            )}
          />
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </span>

        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          {formatDate(timestamp)} · {formatTime(timestamp)} · {formatRelativeTime(timestamp)}
        </span>
      </div>
    </div>
  );
}

export function ActivityLogsSkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-28 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-3.5 w-3/4 bg-slate-100 rounded mt-3" />
      <div className="h-3.5 w-1/2 bg-slate-100 rounded mt-1.5" />
      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}