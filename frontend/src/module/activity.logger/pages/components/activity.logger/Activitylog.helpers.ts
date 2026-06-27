import type {
  ActivityLog,
  MetadataValue,
} from "@/module/activity.logger/types/activity-log.types";

type Metadata = Record<string, MetadataValue>;

const getMeta = (log: ActivityLog): Metadata => log.metadata ?? {};

export const getUserName = (log: ActivityLog): string => {
  const meta = getMeta(log);

  return (
    (meta.recruiterName as string) ||
    (meta.candidateName as string) ||
    (meta.fullName as string) ||
    (meta.userName as string) ||
    (meta.name as string) ||
    log.userId ||
    "System"
  );
};

export const getRole = (log: ActivityLog): string => {
  const meta = getMeta(log);
  const role = (meta.role as string) ?? "system";
  return role.toLowerCase();
};

export const getUserIdSafe = (log: ActivityLog): string => log.userId ?? "";

export const getDescription = (log: ActivityLog): string => {
  const user = getUserName(log);
  const action = log.action.toUpperCase();
  const meta = getMeta(log);

  const templates: Record<string, string> = {
    JOB_POSTED: `${user} created job posting • ${(meta.jobTitle as string) || (meta.title as string) || "—"}`,
    PROFILE_UPDATE: `${user} updated profile information`,
    USER_CREATED: `${user} registered new account`,
    INTERVIEW_SCHEDULED: `${user} scheduled interview session`,
    SYSTEM_ERROR: `Critical error in ${(meta.module as string) || "core system"}`,
    LOGIN_SUCCESS: `${user} signed in`,
    LOGIN_FAILED: `${user} login attempt failed`,
    LOGOUT: `${user} signed out`,
    PASSWORD_RESET: `${user} requested password reset`,
    JOB_PUBLISHED: `${user} published job • ${(meta.title as string) || "—"}`,
  };

  return (
    templates[action] ?? `${user} • ${action.replace(/_/g, " ").toLowerCase()}`
  );
};

export type Severity = "success" | "info" | "warning" | "error";

export const getSeverity = (action: string = ""): Severity => {
  const a = action.toUpperCase();
  if (a.includes("ERROR") || a.includes("FAIL") || a.includes("CRITICAL"))
    return "error";
  if (a.includes("CREATED") || a.includes("POSTED") || a.includes("SUCCESS"))
    return "success";
  if (
    a.includes("UPDATE") ||
    a.includes("SCHEDULED") ||
    a.includes("LOGIN") ||
    a.includes("LOGOUT") ||
    a.includes("RESET")
  )
    return "info";
  return "info";
};

export const formatRelativeTime = (timestamp?: string | number): string => {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
