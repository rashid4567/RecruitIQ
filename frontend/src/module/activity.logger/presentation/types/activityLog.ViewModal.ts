export interface ActivityLogViewModel {
  id: string;
  userName: string;
  action: string;
  entity: string;
  timestamp: string;
  severity: "info" | "success" | "error" | "warning";
}