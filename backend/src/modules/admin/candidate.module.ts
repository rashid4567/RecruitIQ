import { Router } from "express";
import { blockUserController, unblockUserController } from "./Presentation/containers/user-management.container";

const userRouter = Router()

userRouter.patch("/:userId/block", blockUserController.blockUser);

userRouter.patch("/:userId/unblock", unblockUserController.unblockUser);
export default userRouter;