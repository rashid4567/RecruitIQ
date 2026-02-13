import { Router } from "express";
import { activityLogsController } from "../containers/activity-log.container";

const router = Router();

router.get("/",activityLogsController.list);
export default router;