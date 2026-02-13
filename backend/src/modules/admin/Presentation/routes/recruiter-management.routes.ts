import { Router } from "express";
import {
  getRecruiterProfileController,
  getRecruitersController,
  rejectRecruiterController,
  verifyRecruiterController,
} from "../containers/recruiter-management.container";

const recruiterManagementRouter = Router();

recruiterManagementRouter.get("/", getRecruitersController.recruiterList);

recruiterManagementRouter.get(
  "/:recruiterId",
  getRecruiterProfileController.getRecruiterProfile,
);

recruiterManagementRouter.patch(
  "/:recruiterId/verify",
  verifyRecruiterController.verifyRecruiter,
);

recruiterManagementRouter.patch(
  "/:recruiterId/reject",
  rejectRecruiterController.rejectRecruiter,
);

export default recruiterManagementRouter;
