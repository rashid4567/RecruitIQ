import { CheckCircle2, AlertTriangle, Eye, RotateCw, Mail, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EmailLog } from "@/module/email/types/email.types";
import {
  formatDate,
  formatTime,
  getInitials,
  getAvatarColor,
} from "./EmailLogsTableRow";

interface EmailLogsCardProps {
  log: EmailLog;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function EmailLogsCard({ log, isSelected, onSelect }: EmailLogsCardProps) {
  const id = log.id ?? "";
  const failed = log.status === "FAILED";
  const isTest = log.type === "TEST";
  const recipient = log.to;
  const initials = getInitials(recipient);
  const avatarColor = getAvatarColor(recipient);

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm transition-colors",
        isSelected
          ? "border-indigo-200 bg-indigo-50/40"
          : failed
            ? "border-rose-100 bg-rose-50/20"
            : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(id)}
            aria-label={`Select email to ${recipient}`}
            className="border-slate-300 shrink-0"
          />
          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
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

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
          </Button>
          {failed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50"
            >
              <RotateCw className="h-3.5 w-3.5" strokeWidth={1.8} />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 mt-3">
        <Mail className="h-3.5 w-3.5 text-slate-300 mt-0.5 shrink-0" strokeWidth={1.5} />
        <p className="text-[13px] text-slate-700 line-clamp-2">{log.subject}</p>
      </div>

      {failed && log.error && (
        <p className="text-[11px] text-rose-500 mt-1.5 ml-5.5 line-clamp-2">
          {log.error}
        </p>
      )}

      <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
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

        {failed ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-rose-50 text-rose-700 border-rose-200">
            <AlertTriangle className="h-3 w-3" strokeWidth={2.5} /> Failed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} /> Sent
          </span>
        )}

        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" /> {formatDate(log.createdAt)} · {formatTime(log.createdAt)}
        </span>
      </div>
    </div>
  );
}

export function EmailLogsSkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-2.5">
        <div className="h-4 w-4 bg-slate-200 rounded shrink-0" />
        <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-3.5 w-3/4 bg-slate-200 rounded mt-3" />
      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}