import { Router } from "express";
import { recruiterAdminController } from "../recruiter.module";

const router = Router();

router.get("", recruiterAdminController.getRecruiter);
router.get(
  "/:recruiterId",
  recruiterAdminController.getRecruiterProfile
);

router.patch(
  "/:recruiterId/verify",
  recruiterAdminController.verifyRecruiter
);

router.patch(
  "/:recruiterId/block",
  recruiterAdminController.blockRecruiter
);

router.patch(
  "/:recruiterId/unblock",
  recruiterAdminController.unblockRecruiter
);

export default router;
