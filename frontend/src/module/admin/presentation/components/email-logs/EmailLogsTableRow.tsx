import {
  CheckCircle2,
  AlertTriangle,
  Eye,
  RotateCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { EmailLog } from "../../../domain/entities/email-log.entity";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmailLogsTableRowProps {
  log: EmailLog;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function EmailLogsTableRow({ log, isSelected, onSelect }: EmailLogsTableRowProps) {
  const id = log.getId() ?? "";
  const failed = log.getStatus() === "FAILED";


  const formatExactTime = (ts: string | number) => {
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  };

  const getStatusBadge = () => {
    const status = log.getStatus();
    const isFailed = status === "FAILED";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm",
                isFailed
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200",
              )}
            >
              {isFailed ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {status}
            </Badge>
          </TooltipTrigger>
          {isFailed && log.getError() && (
            <TooltipContent className="max-w-xs">
              <p className="font-medium">Error:</p>
              <p className="text-xs text-rose-800 mt-1">{log.getError()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <TableRow
      className={cn(
        "hover:bg-slate-50/80 transition-colors border-b last:border-0",
        isSelected && "bg-indigo-50/40",
        failed && "bg-rose-50/30",
      )}
    >
      <TableCell className="pl-6">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(id)}
          aria-label={`Select email to ${log.getRecipient()}`}
        />
      </TableCell>
      <TableCell className="text-sm text-slate-600 whitespace-nowrap font-medium">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{formatExactTime(log.getTimeStamp())}</span>
            </TooltipTrigger>
            <TooltipContent>
              {new Date(log.getTimeStamp()).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "medium",
              })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      <TableCell className="font-medium text-slate-900">
        {log.getRecipient()}
      </TableCell>

      <TableCell className="max-w-md truncate text-slate-700">
        {log.getSubject()}
      </TableCell>

      <TableCell>
        <Badge
          variant="secondary"
          className="px-3 py-1 text-xs bg-slate-100/80 border border-slate-200 rounded-full"
        >
          {log.getType()}
        </Badge>
      </TableCell>

      <TableCell>{getStatusBadge()}</TableCell>

      <TableCell className="text-right pr-8">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:text-indigo-700"
          >
            <Eye className="h-4.5 w-4.5" />
          </Button>
          {failed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-indigo-600 hover:text-indigo-700"
            >
              <RotateCw className="h-4.5 w-4.5" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}