import { ActivityLog } from "@/module/admin/domain/entities/activity-log.enitity";

export const getValue = (obj: any, method: string, field: string) =>
  typeof obj?.[method] === "function" ? obj[method]() : obj?.[field] ?? null;

export const getUserName = (log: ActivityLog): string => {
  const meta = getValue(log, "getMetadata", "metadata") || {};
  return (
    meta.fullName ||
    meta.userName ||
    meta.name ||
    getValue(log, "getUserId", "userId") ||
    "System"
  );
};

export const getRole = (log: ActivityLog): string => {
  const meta = getValue(log, "getMetadata", "metadata") || {};
  const role =
    meta.role || getValue(log, "getRole", "role") || "system";
  return (role as string).toLowerCase();
};

export const getUserIdSafe = (log: ActivityLog): string =>
  getValue(log, "getUserId", "userId") || "";

export const getDescription = (log: ActivityLog): string => {
  const user = getUserName(log);
  const action = (getValue(log, "getAction", "action") || "").toUpperCase();
  const meta = getValue(log, "getMetadata", "metadata") || {};

  const templates: Record<string, string> = {
    JOB_POSTED: `${user} created job posting • ${meta.jobTitle || meta.title || "—"}`,
    PROFILE_UPDATE: `${user} updated profile information`,
    USER_CREATED: `${user} registered new account`,
    INTERVIEW_SCHEDULED: `${user} scheduled interview session`,
    SYSTEM_ERROR: `Critical error in ${meta.module || "core system"}`,
    LOGIN_SUCCESS: `${user} signed in`,
    LOGIN_FAILED: `${user} login attempt failed`,
    LOGOUT: `${user} signed out`,
    PASSWORD_RESET: `${user} requested password reset`,
  };

  return (
    templates[action] ||
    `${user} • ${action.replace(/_/g, " ").toLowerCase()}`
  );
};

export type Severity = "success" | "info" | "warning" | "error";

export const getSeverity = (action: string = ""): Severity => {
  const a = action.toUpperCase();
  if (a.includes("ERROR") || a.includes("FAIL") || a.includes("CRITICAL"))
    return "error";
  if (
    a.includes("CREATED") ||
    a.includes("POSTED") ||
    a.includes("SUCCESS")
  )
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

export const formatRelativeTime = (
  timestamp?: string | number
): string => {
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