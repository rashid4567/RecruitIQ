import { Router } from "express";
import { applyController } from "../container/JobApplication.module";

const router = Router();

router.post("/jobs/:jobId/apply", applyController.apply);


export default router;