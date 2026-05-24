import { Router } from "express";
import { activityLogsController } from "../../../Activity.logger/presentation/container/activity-log.container";

const router = Router();

router.get("/", activityLogsController.list);
export default router;
