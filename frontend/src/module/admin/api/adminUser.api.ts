import api from "@/api/axios";
import { USER_ROUTES } from "../constant/user.routes";

export const blockUser = async (
  userId: string,
): Promise<void> => {
  await api.patch(USER_ROUTES.BLOCK_USER(userId));
};

export const unblockUser = async (
  userId: string,
): Promise<void> => {
  await api.patch(USER_ROUTES.UNBLOCK_USER(userId));
};