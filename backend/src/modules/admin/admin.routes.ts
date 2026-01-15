import { Router } from "express";
import { getRecruiterProfileController, getRecruiters, updateRecruiterStatusController, verifyRecruite } from "./recruiterMangment/recruiter.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireAdmin } from "../../middlewares/role.middleware";
import { blockCandidate, getCandidate, getCandidateProfile, unblockCandidate } from "../admin/candidateMangment/candidate.controller";
const router = Router()
router.use(authenticate)
router.use(requireAdmin);

router.get("/recruiters", getRecruiters)
router.patch("/recruiters/:userId/verify",verifyRecruite)
router.patch("/recruiters/:userId/status",updateRecruiterStatusController)
router.get("/recruiters/:id",getRecruiterProfileController)




router.get("/candidates", getCandidate)
router.patch("/candidates/:candidateId/block", blockCandidate);
router.patch("/candidates/:candidateId/unblock", unblockCandidate);
router.get("/candidates/:candidateId", getCandidateProfile);


export default router;