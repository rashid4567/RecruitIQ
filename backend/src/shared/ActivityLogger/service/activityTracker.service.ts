import { logActivity } from "../logging/activity.logger";
import { ActivityLogData } from "../types/activity.types";

export class ActivityTrackerService {
  track(data: ActivityLogData): void {
    logActivity(data);
  }
}
