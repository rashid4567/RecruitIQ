import { Router } from "express";
import { candidateController } from "../candidate.module";
import { requireAdmin } from "../../../../middlewares/role.middleware";
import { authenticate } from "../../../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);
router.use(requireAdmin);

router.get("", candidateController.getCandidates);

router.get("/:candidateId", candidateController.getCandidateProfile);

router.patch("/:candidateId/block", candidateController.blockCandidate);

router.patch("/:candidateId/unblock", candidateController.unblockCandidate);

export default router;
