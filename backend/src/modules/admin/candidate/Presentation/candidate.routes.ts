import { Router } from "express";

import {
  blockUserController,
  unblockUserController,
  getCandidatesController,
  getCandidateProfileController,
  getRecruitersController,
  getRecruiterProfileController,
  verifyRecruiterController,
  rejectRecruiterController,
} from "../candidate.module";

const adminRouter = Router();

adminRouter.get("/candidates", getCandidatesController.getCandidates);

adminRouter.get(
  "/candidates/:candidateId",
  getCandidateProfileController.getCandidateProfile,
);

adminRouter.patch("/:userId/block", blockUserController.blockUser);

adminRouter.patch("/:userId/unblock", unblockUserController.unblockUser);

adminRouter.get("/recruiters", getRecruitersController.recruiterList);

adminRouter.get(
  "/recruiters/:recruiterId",
  getRecruiterProfileController.getRecruiterProfile,
);

adminRouter.patch(
  "/recruiters/:recruiterId/verify",
  verifyRecruiterController.verifyRecruiter,
);

adminRouter.patch(
  "/recruiters/:recruiterId/reject",
  rejectRecruiterController.rejectRecruiter,
);

export default adminRouter;
