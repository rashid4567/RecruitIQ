import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { updateRecruiterProfile, getRecruiterProfile } from "./recruiter.controller";
const router = Router();

router.get("/complete-profile",authenticate,getRecruiterProfile);
router.put("/complete-profile",authenticate,updateRecruiterProfile);


export default router;