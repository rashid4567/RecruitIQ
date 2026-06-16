import {
  CheckCircle2,
  AlertTriangle,
  Eye,
  RotateCw,
  Mail,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { EmailLog } from "../../../../email/domain/entity/email-log.entity";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmailLogsTableRowProps {
  log: EmailLog;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/* ─── Helpers ───────────────────────────────────────────────── */

function formatDate(ts: string | number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(ts: string | number) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitials(email: string) {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-sky-100 text-sky-700",
  "bg-teal-100 text-teal-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

function getAvatarColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ─── Component ─────────────────────────────────────────────── */

export function EmailLogsTableRow({ log, isSelected, onSelect }: EmailLogsTableRowProps) {
  const id = log.getId() ?? "";
  const failed = log.getStatus() === "FAILED";
  const isTest = log.getType() === "TEST";
  const recipient = log.getRecipient();
  const initials = getInitials(recipient);
  const avatarColor = getAvatarColor(recipient);

  return (
    <TooltipProvider>
      <TableRow
        className={cn(
          "group border-b border-slate-100/80 transition-colors duration-150",
          isSelected
            ? "bg-indigo-50/40 hover:bg-indigo-50/60"
            : failed
            ? "bg-rose-50/20 hover:bg-rose-50/40"
            : "hover:bg-slate-50/70",
        )}
      >
        {/* Checkbox */}
        <TableCell className="pl-6 w-12">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(id)}
            aria-label={`Select email to ${recipient}`}
            className="border-slate-300"
          />
        </TableCell>

        {/* Sent At */}
        <TableCell className="w-44">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-default">
                <p className="text-[13px] font-semibold text-slate-700 leading-snug">
                  {formatDate(log.getCreatedAt())}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {formatTime(log.getCreatedAt())}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {new Date(log.getCreatedAt()).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "medium",
              })}
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* Recipient */}
        <TableCell className="w-56">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                avatarColor,
              )}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 truncate">
                {recipient.split("@")[0]}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                @{recipient.split("@")[1]}
              </p>
            </div>
          </div>
        </TableCell>

        {/* Subject */}
        <TableCell className="max-w-xs">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-start gap-2 cursor-default">
                <Mail className="h-3.5 w-3.5 text-slate-300 mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="text-[13px] text-slate-700 truncate max-w-[260px]">
                  {log.getSubject()}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm text-xs">
              {log.getSubject()}
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* Type */}
        <TableCell className="w-28">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
              isTest
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-600 border-slate-200",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isTest ? "bg-amber-400" : "bg-slate-400",
              )}
            />
            {isTest ? "Test" : "Real"}
          </span>
        </TableCell>

        {/* Status */}
        <TableCell className="w-28">
          {failed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-rose-50 text-rose-700 border-rose-200 cursor-default">
                  <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                  Failed
                </span>
              </TooltipTrigger>
              {log.getError() && (
                <TooltipContent side="top" className="max-w-xs text-xs">
                  <p className="font-semibold mb-1">Error details</p>
                  <p className="text-rose-300">{log.getError()}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
              Sent
            </span>
          )}
        </TableCell>

        {/* Actions */}
        <TableCell className="pr-6 w-20">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">View details</TooltipContent>
            </Tooltip>

            {failed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <RotateCw className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">Retry send</TooltipContent>
              </Tooltip>
            )}
          </div>
        </TableCell>
      </TableRow>
    </TooltipProvider>
  );
}