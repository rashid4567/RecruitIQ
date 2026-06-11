import { Briefcase, User, MoreHorizontal, Copy, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ActivityLog } from "@/module/activity.logger/domain/entity/activity-log.enitity";
import {
  getUserName,
  getRole,
  getUserIdSafe,
  getDescription,
  getSeverity,
  formatRelativeTime,
} from "./Activitylog.helpers";
import { severityConfig } from "./Activitylog.config";

interface ActivityLogsTableRowProps {
  log: ActivityLog;
}

/* ─── Avatar color ─────────────────────────────────────────── */

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
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ─── Row ──────────────────────────────────────────────────── */

export function ActivityLogsTableRow({ log }: ActivityLogsTableRowProps) {
  const navigate = useNavigate();

  const action = log.getAction();
  const severity = getSeverity(action);
  const cfg = severityConfig[severity];
  const timestamp = log.getTimestamp();
  const metadata = log.getMetadata() ?? {};
  const isError = severity === "error";

  const entityLabel =
    (metadata.title as string) ||
    (metadata.jobTitle as string) ||
    log.getEntity() ||
    "—";

  const name = getUserName(log);
  const initials = name.slice(0, 2).toUpperCase() || "?";
  const avColor = avatarColor(name, isError);

  const handleActorClick = () => {
    const uid = getUserIdSafe(log);
    if (!uid) return;
    const role = getRole(log);
    if (role.includes("candidate")) navigate(`/admin/candidates/${uid}`);
    else if (role.includes("recruiter") || role.includes("admin")) navigate(`/admin/recruiters/${uid}`);
  };

  const handleEntityClick = () => {
    const entityId = log.getEntityId();
    const entityType = log.getEntity();
    if (!entityId || !entityType) return;
    switch (entityType.toUpperCase()) {
      case "JOB": navigate(`/admin/jobPosts`); break;
      case "USER": navigate(`/admin/users/${entityId}`); break;
      case "SUBSCRIPTION": navigate(`/admin/subscriptions/${entityId}`); break;
    }
  };

  const formatDate = (ts: string | number) =>
    new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatTime = (ts: string | number) =>
    new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <TableRow
      className={cn(
        "group border-b border-slate-100/80 last:border-0 transition-colors duration-150",
        isError ? "bg-rose-50/20 hover:bg-rose-50/40" : "hover:bg-slate-50/60",
      )}
    >
      {/* Checkbox */}
      <TableCell className="pl-6 w-12">
        <Checkbox className="border-slate-300" />
      </TableCell>

      {/* Time */}
      <TableCell className="w-36">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-default">
              <p className="text-[13px] font-semibold text-slate-700 leading-snug">
                {formatDate(timestamp)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formatTime(timestamp)}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {new Date(timestamp).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "medium" })}
          </TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Relative time */}
      <TableCell className="w-28 hidden lg:table-cell">
        <span className="text-[11px] text-slate-400 font-medium">
          {formatRelativeTime(timestamp)}
        </span>
      </TableCell>

      {/* Severity */}
      <TableCell className="w-28">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
            cfg.badge,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isError ? "bg-rose-500" : "bg-indigo-400")} />
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </span>
      </TableCell>

      {/* Actor */}
      <TableCell className="w-56">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleActorClick}
              className="flex items-center gap-2.5 w-full text-left group/actor"
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                avColor,
              )}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-800 truncate max-w-[140px] group-hover/actor:text-indigo-700 transition-colors">
                  {name}
                </p>
                <p className="text-[11px] text-slate-400 capitalize mt-0.5">
                  {getRole(log)}
                </p>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">View profile</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Entity */}
      <TableCell className="w-44">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleEntityClick}
              className="flex items-center gap-2 text-left group/entity"
            >
              <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                {action.toUpperCase().includes("JOB") ? (
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
                ) : (
                  <User className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
                )}
              </div>
              <span className="text-[13px] text-slate-600 truncate max-w-[120px] group-hover/entity:text-indigo-700 transition-colors">
                {entityLabel}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">View entity</TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Description */}
      <TableCell>
        <p className="text-[13px] text-slate-600 line-clamp-2 max-w-[340px] leading-relaxed">
          {getDescription(log)}
        </p>
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-6 w-14 text-right">
        <Popover>
          <PopoverTrigger asChild>
            <button className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150 ml-auto",
              "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
              "opacity-0 group-hover:opacity-100",
            )}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg border-slate-200">
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
      </TableCell>
    </TableRow>
  );
}