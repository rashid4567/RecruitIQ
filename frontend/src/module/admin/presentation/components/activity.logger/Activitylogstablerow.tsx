import { Briefcase, User, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import { ActivityLog } from "../../types/Activitylog.types";
import {
  getValue,
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

export function ActivityLogsTableRow({ log }: ActivityLogsTableRowProps) {
  const navigate = useNavigate();
  const action = getValue(log, "getAction", "action") || "";
  const severity = getSeverity(action);
  const cfg = severityConfig[severity];

  return (
    <TableRow
      className={cn(
        "group border-b last:border-0 transition-colors hover:bg-slate-50/80",
        cfg.bg,
        cfg.border
      )}
    >
      <TableCell>
        <Checkbox className="translate-y-0.5" />
      </TableCell>

      <TableCell className="text-sm text-slate-600 whitespace-nowrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              {formatRelativeTime(getValue(log, "getTimestamp", "timestamp"))}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {new Date(
              getValue(log, "getTimestamp", "timestamp") || 0
            ).toLocaleString()}
          </TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Badge className={cn("px-3 py-1 text-xs font-medium", cfg.badge)}>
          {severity}
        </Badge>
      </TableCell>

      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center gap-3 hover:underline w-full text-left"
              onClick={() => {
                const uid = getUserIdSafe(log);
                if (!uid) return;
                const role = getRole(log);
                if (role.includes("candidate"))
                  navigate(`/admin/candidates/${uid}`);
                else if (
                  role.includes("recruiter") ||
                  role.includes("admin")
                )
                  navigate(`/admin/recruiters/${uid}`);
              }}
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm",
                  severity === "error" ? "bg-rose-600" : "bg-indigo-600"
                )}
              >
                {getUserName(log)?.slice(0, 2).toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate max-w-65">
                  {getUserName(log)}
                </div>
                <div className="text-xs text-slate-500 capitalize mt-0.5">
                  {getRole(log)}
                </div>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">View profile</TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell className="text-sm text-slate-600">
        <div className="flex items-center gap-2">
          {action.toUpperCase().includes("JOB") ? (
            <Briefcase className="h-4 w-4 text-slate-400" />
          ) : (
            <User className="h-4 w-4 text-slate-400" />
          )}
          <span className="truncate max-w-45">
            {getValue(log, "getEntity", "entity") || "—"}
          </span>
        </div>
      </TableCell>

      <TableCell className="text-sm text-slate-700">
        <div className="line-clamp-2 max-w-150">{getDescription(log)}</div>
      </TableCell>

      <TableCell className="text-right pr-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-1.5 rounded-xl shadow-lg">
            <div className="space-y-0.5">
              <button className="w-full text-left px-4 py-2.5 text-sm rounded-lg hover:bg-slate-100">
                View full details
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm rounded-lg hover:bg-slate-100">
                Copy event ID
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
}