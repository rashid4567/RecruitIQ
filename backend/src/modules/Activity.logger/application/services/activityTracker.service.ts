import { ActivityLogData } from "../types/activity-log-data.type";

import { logActivity } from "../../infrastructure/logging/activity.logger";

export class ActivityTrackerService {
  track(data: ActivityLogData): void {
    logActivity(data);
  }
}
