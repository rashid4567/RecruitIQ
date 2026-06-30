import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import { STATUS_COLORS, STATUS_LABELS, STATUS_DOT_COLORS } from "./Status.constants";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none ${STATUS_COLORS[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT_COLORS[status]}`}
        aria-hidden="true"
      />
      {STATUS_LABELS[status]}
    </span>
  );
}