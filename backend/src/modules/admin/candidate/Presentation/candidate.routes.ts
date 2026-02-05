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

adminRouter.patch("/candidates/:userId/block", blockUserController.blockUser);

adminRouter.patch(
  "/candidates/:userId/unblock",
  unblockUserController.unblockUser,
);

adminRouter.get("/recruiters", getRecruitersController.recruiterList);

adminRouter.get(
  "/recruiters/:recruiterId",
  getRecruiterProfileController.getRecruiterProfile,
);

adminRouter.patch("/recruiters/:userId/block", blockUserController.blockUser);

adminRouter.patch(
  "/recruiters/:userId/unblock",
  unblockUserController.unblockUser,
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
