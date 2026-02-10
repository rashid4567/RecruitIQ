import { Router } from "express";
import {
  getCandidateProfileController,
  getCandidatesController,
} from "../containers/candidate-management.container";

const candidateManagementRouter = Router();

candidateManagementRouter.get("/", getCandidatesController.getCandidates);

candidateManagementRouter.get(
  "/:candidateId",
  getCandidateProfileController.getCandidateProfile,
);

export default candidateManagementRouter;
