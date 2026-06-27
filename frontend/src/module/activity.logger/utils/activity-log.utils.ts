import type { ActivityLog } from "../types/activity-log.types";

export function getActivityUserName(log: ActivityLog): string {
  const meta = log.metadata;

  return (
    (meta?.recruiterName as string) ||
    (meta?.candidateName as string) ||
    (meta?.fullName as string) ||
    (meta?.userName as string) ||
    (meta?.name as string) ||
    log.userId
  );
}