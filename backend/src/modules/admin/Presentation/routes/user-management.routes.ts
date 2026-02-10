import { Router } from "express";
import {
  blockUserController,
  unblockUserController,
} from "../containers/user-management.container";

const userManagementRouter = Router();

userManagementRouter.patch("/:userId/block", blockUserController.blockUser);

userManagementRouter.patch(
  "/:userId/unblock",
  unblockUserController.unblockUser,
);

export default userManagementRouter;
