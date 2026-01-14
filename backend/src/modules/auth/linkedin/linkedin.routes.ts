import { Router } from "express";
import { redirectToLinkedIn, handleLinkedInCallback } from "./linkedin.controller";
const router = Router();

router.get("/",redirectToLinkedIn)
router.get("/callback",handleLinkedInCallback);
export default router;
