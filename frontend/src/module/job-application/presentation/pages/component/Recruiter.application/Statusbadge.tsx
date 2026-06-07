
import { ApplicationStatus } from "@/module/job-application/domain/entity/job-application.entity";
import { STATUS_COLORS, STATUS_LABELS } from "./Status.constants"; 

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}